import { productModel } from "../model/productModel.js";

class ProductsRepository {
  async getProducts(filter = {}) {
    return await productModel.find(filter);
  }

  async getProductById(pid) {
    return await productModel.findById(pid);
  }

  async createProduct(product) {
    return await productModel.create(product);
  }

  async updateProduct(pid, update) {
    return await productModel.findByIdAndUpdate(pid, update, { new: true });
  }

  async deleteProduct(pid) {
    return await productModel.findByIdAndDelete(pid);
  }
}

export default new ProductsRepository();
