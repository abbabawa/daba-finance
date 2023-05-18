import mongoose, { model, Schema, Model, Document } from 'mongoose';

export interface ITransaction extends Document {
    sender:string;
    recipient:string;
    amount:number;
    transaction_date:string;
}

const TransactionSchema: Schema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        required: [true, "Can't be blank"],
        ref: 'User'
    },
    recipient: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true,
    },

    transaction_date: { type: Date, default: Date.now() }
});

export const Transaction:Model<ITransaction> = mongoose.model("Transaction", TransactionSchema);