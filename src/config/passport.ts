import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as AppleStrategy } from 'passport-apple';
import { AuthService } from '#services/authService';

const configurePassport = () => {
  // Google Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
    callbackURL: "/api/v1/auth/google/callback",
    proxy: true
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0].value;
      const user = await AuthService.findOrCreateSocialUser({
        email,
        id: profile.id,
        provider: 'google',
        photos: profile.photos
      });
      return done(null, user);
    } catch (err) {
      return done(err as Error);
    }
  }));

  // Facebook Strategy
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID || 'dummy',
    clientSecret: process.env.FACEBOOK_APP_SECRET || 'dummy',
    callbackURL: "/api/v1/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name', 'photos']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0].value;
      const user = await AuthService.findOrCreateSocialUser({
        email,
        id: profile.id,
        provider: 'facebook',
        photos: profile.photos
      });
      return done(null, user);
    } catch (err) {
      return done(err as Error);
    }
  }));

  // X (Twitter) Strategy
  passport.use(new TwitterStrategy({
    consumerKey: process.env.X_CONSUMER_KEY || 'dummy',
    consumerSecret: process.env.X_CONSUMER_SECRET || 'dummy',
    callbackURL: "/api/v1/auth/x/callback",
    includeEmail: true
  }, async (token, tokenSecret, profile, done) => {
    try {
      const email = profile.emails?.[0].value;
      const user = await AuthService.findOrCreateSocialUser({
        email,
        id: profile.id,
        provider: 'x',
        photos: profile.photos
      });
      return done(null, user);
    } catch (err) {
      return done(err as Error);
    }
  }));

  // Apple Strategy (Simplified placeholder - Apple requires more config like keyId, teamId, privateKey)
  // passport.use(new AppleStrategy({ ... }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    // In a stateless JWT app, we don't strictly need this, but passport might expect it
    done(null, { id } as any);
  });
};

export default configurePassport;
