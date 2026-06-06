import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

export const generateToken = (user) => {
  return jwt.sign(user, PRIVATE_KEY, {
    expiresIn: "24h",
  });
};

export const generateRecoveryToken = (email) => {
  return jwt.sign({ email }, PRIVATE_KEY, { expiresIn: "1h" });
};

export default PRIVATE_KEY;
