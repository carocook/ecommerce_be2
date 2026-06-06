import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,

  email: {
    type: String,
    unique: true,
    required: true,
  },

  age: Number,

  password: String,

  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cart",
  },

  role: {
    type: String,
    default: "user",
  },
});

export const UserModel = mongoose.model(userCollection, userSchema);
