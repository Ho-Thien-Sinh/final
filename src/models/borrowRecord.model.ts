import { Schema, model, Document, Types } from 'mongoose';

export interface IBorrowRecord extends Document {
    userId: Types.ObjectId;
    bookId: Types.ObjectId;
    borrowDate: Date;
    returnDate?: Date;
    status: 'BORROWED' | 'RETURNED';
}

const borrowRecordSchema = new Schema<IBorrowRecord>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    borrowDate: { type: Date, required: true, default: Date.now },
    returnDate: { type: Date },
    status: { type: String, enum: ['BORROWED', 'RETURNED'], default: 'BORROWED' }
}, {
    timestamps: true
});

export const BorrowRecord = model<IBorrowRecord>('BorrowRecord', borrowRecordSchema);