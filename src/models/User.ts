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
}

const userSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    refreshToken: [String],
    provider: {
        type: String,
        default: 'local'
    },
    providerId: String,
    avatar: String,
    passwordResetToken: String,
    passwordResetExpires: Date
});

export default mongoose.model<IUser>('User', userSchema);
