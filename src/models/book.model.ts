import { Schema, model, Document } from 'mongoose';

export interface IBook extends Document {
    title: string;
    author: string;
    quantity: number;
    availableQuantity: number;
}

const bookSchema = new Schema<IBook>({
    title: { type: String, required: true },
    author: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    availableQuantity: { type: Number, required: true, default: 1 }
}, {
    timestamps: true
});

export const Book = model<IBook>('Book', bookSchema);
