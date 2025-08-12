import { Schema, model, Document } from 'mongoose';

export interface IBook extends Document {
    title: string;
    author: string;
}

const bookSchema = new Schema<IBook>({
    title: { type: String, required: true },
    author: { type: String, required: true }
}, {
    timestamps: true
});

export const Book = model<IBook>('Book', bookSchema);
