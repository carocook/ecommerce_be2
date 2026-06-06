import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  purchaser: {
    type: String,
    required: true,
  },

  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
      quantity: Number,
      price: Number,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const ticketModel = mongoose.model("ticket", ticketSchema);
