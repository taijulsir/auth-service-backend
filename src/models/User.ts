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
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, select: false },
    roles: {
        User: { type: Number, default: 2001 },
        Editor: { type: Number },
        Admin: { type: Number }
    },
    refreshToken: [{ type: String }],
    provider: { type: String, default: 'local' },
    providerId: { type: String },
    avatar: { type: String },
    passwordResetToken: { type: String, select: false },
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
