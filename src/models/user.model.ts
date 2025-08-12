import {Schema, model, Document} from 'mongoose';

export interface IUser extends Document {
    username: string;
    password: string;
    fullname: string;
    role: 'admin' | 'user';
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
}, {
    timestamps: true
});

export const User = model<IUser>('User', userSchema);
