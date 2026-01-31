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
}

const userSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
        },
        Editor: Number,
        Admin: Number
    },
    refreshToken: [String]
});

export default mongoose.model<IUser>('User', userSchema);
