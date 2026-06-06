import { cartModel } from "../model/cartModel.js";

class CartRepository {
  async createCart(userId) {
    return await cartModel.create({
      user: userId,
      products: [],
    });
  }

  async getCartById(cid) {
    return await cartModel.findById(cid);
  }

  async getCartByUser(userId) {
    return await cartModel.findOne({ user: userId });
  }

  async addProductToCart(cid, pid) {
    const cart = await cartModel.findById(cid);

    if (!cart) throw new Error("Cart not found");

    const index = cart.products.findIndex((p) => p.product.toString() === pid);

    if (index === -1) {
      cart.products.push({
        product: pid,
        quantity: 1,
      });
    } else {
      cart.products[index].quantity += 1;
    }

    return await cart.save();
  }

  async removeProductFromCart(cid, pid) {
    const cart = await cartModel.findById(cid);

    if (!cart) throw new Error("Cart not found");

    cart.products = cart.products.filter((p) => p.product.toString() !== pid);

    return await cart.save();
  }

  async clearCart(cid) {
    const cart = await cartModel.findById(cid);

    if (!cart) throw new Error("Cart not found");

    cart.products = [];

    return await cart.save();
  }
}

export default new CartRepository();
