import {Schema, model, Document} from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    role: 'admin' | 'user';
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
}, {
    timestamps: true
});

export const User = model<IUser>('User', userSchema);
