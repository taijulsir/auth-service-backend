import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password?: string;
    roles: {
        User: number;
        Editor?: number;
        Admin?: number;
    };
    refreshToken: string[];
    provider?: string;
    providerId?: string;
    avatar?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    is2FAEnabled: boolean;
    twoFactorSecret?: string;
}

const userSchema: Schema = new Schema({
    // ...existing code...
    passwordResetExpires: Date,
    is2FAEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorSecret: {
        type: String,
        select: false // Hide by default for security
    }
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);
