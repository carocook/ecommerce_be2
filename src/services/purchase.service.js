import CartRepository from "../repositories/CartRepository.js";
import TicketRepository from "../repositories/TicketRepository.js";
import { productModel } from "../model/productModel.js";
import crypto from "crypto";

export const purchaseCart = async (cid, userEmail) => {
  const cart = await CartRepository.getCartById(cid);

  if (!cart) throw new Error("Cart not found");

  let totalAmount = 0;
  const purchasedProducts = [];
  const rejectedProducts = [];

  for (let item of cart.products) {
    const product = await productModel.findById(item.product._id);

    if (!product) continue;

    if (product.stock >= item.quantity) {
      product.stock -= item.quantity;
      await product.save();

      purchasedProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      totalAmount += product.price * item.quantity;
    } else {
      rejectedProducts.push(item);
    }
  }

  if (purchasedProducts.length === 0) {
    throw new Error("No products available for purchase");
  }

  const ticket = await TicketRepository.create({
    code: crypto.randomUUID(),
    amount: totalAmount,
    purchaser: userEmail,
    products: purchasedProducts,
  });

  // actualizar carrito solo con rechazados
  cart.products = rejectedProducts;
  await cart.save();

  return ticket;
};
