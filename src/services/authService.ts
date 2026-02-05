import User from '#models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UnauthorizedError, ForbiddenError, BadRequestError } from '#utils/AppError';
import { MailService } from '#services/mailService';

export class AuthService {
  static async verifyUserCredentials(email: string, pwd: string) {
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const match = await bcrypt.compare(pwd, foundUser.password!);
    if (!match) {
      throw new UnauthorizedError('Invalid credentials');
    }

    return foundUser;
  }

  static generateTokens(user: any) {
    const roles = Object.values(user.roles).filter(Boolean);

    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "email": user.email,
          "roles": roles
        }
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { "email": user.email },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken, roles };
  }

  static async updateRefreshToken(userId: string, oldToken: string | null, newToken: string) {
    const user = await User.findById(userId);
    if (!user) return;

    const newRefreshTokenArray = !user.refreshToken
      ? [newToken]
      : user.refreshToken.filter(rt => rt !== oldToken).concat(newToken);

    user.refreshToken = newRefreshTokenArray.filter(rt => rt);
    await user.save();
  }

  static async handleRefreshTokenReuse(refreshToken: string) {
    return new Promise((resolve) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
        async (err: any, decoded: any) => {
          if (err) return resolve(false); 
          
          const hackedUser = await User.findOne({ email: decoded.email }).exec();
          if (hackedUser) {
            hackedUser.refreshToken = []; 
            await hackedUser.save();
          }
          resolve(true);
        }
      );
    });
  }

  static async verifyRefreshToken(refreshToken: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
        (err: any, decoded: any) => {
          if (err) return reject(new ForbiddenError('Invalid or expired refresh token'));
          resolve(decoded);
        }
      );
    });
  }

  static async findOrCreateSocialUser(profile: any) {
    const { email, id, provider, photos } = profile;
    
    let user = await User.findOne({ 
      $or: [
        { email },
        { providerId: id, provider }
      ]
    });

    if (!user) {
      user = await User.create({
        email,
        provider,
        providerId: id,
        avatar: photos && photos.length > 0 ? photos[0].value : null,
        roles: { User: 2001 },
        refreshToken: []
      });
    } else if (user.provider === 'local') {
      // Link social provider to existing local account
      user.provider = provider;
      user.providerId = id;
      if (!user.avatar && photos && photos.length > 0) {
        user.avatar = photos[0].value;
      }
      await user.save();
    }

    return user;
  }

  static async registerUser(email: string, pwd: string) {
    const duplicate = await User.findOne({ email }).exec();
    if (duplicate) {
      throw new ForbiddenError('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(pwd, 10);
    const newUser = await User.create({
      email: email,
      password: hashedPassword,
      roles: { User: 2001 },
      refreshToken: []
    });

    return newUser;
  }

  static async logout(refreshToken: string) {
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (foundUser) {
      foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
      await foundUser.save();
    }
  }

  static async requestPasswordReset(email: string) {
    const user = await User.findOne({ email, provider: 'local' }).exec();
    if (!user) {
      // For security reasons, don't confirm if user exists or not
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    await MailService.sendPasswordResetEmail(email, resetToken);
  }

  static async resetPassword(token: string, newPwd: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    }).exec();

    if (!user) {
      throw new BadRequestError('Token is invalid or has expired');
    }

    user.password = await bcrypt.hash(newPwd, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  }
}
