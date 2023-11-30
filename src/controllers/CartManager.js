import fs from "fs";
import { nanoid } from "nanoid";
import { ProductManager } from "./ProductManager.js";

const products = new ProductManager();

class CartManager {
  constructor() {
    this.path = "./src/models/carts.json";
    if (fs.existsSync(this.path)) {
      let carts = fs.readFileSync(this.path, "utf-8");
      this.carts = JSON.parse(carts);
    } else {
      this.carts = [];
      fs.writeFileSync(this.path, JSON.stringify(this.carts, null, "\t"));
    }
  }

  writeCarts = async (carts) => {
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
  };

  getCarts = async () => {
    let carts = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(carts);
  };

  addCart = async () => {
    let carts = await this.getCarts();
    let cartId = nanoid(5);
    let cart = {
      Id: cartId,
      products: [],
    };
    carts.push(cart);
    await this.writeCarts(carts);
    return "Cart added";
  };

  getCartById = async (id) => {
    let carts = await this.getCarts();
    let cartById = carts.find((cart) => cart.Id === id);
    if (!cartById) {
      throw new Error(`No cart found with id: ${id}`);
    } else {
      return cartById;
    }
  };

  addProductToCart = async (cartId, productId) => {
    let carts = await this.getCarts();
    let selectedCart = carts.find((cart) => cart.Id === cartId);
    if (!selectedCart) return `No cart found with id: ${cartId}`;
    let selectedProduct = await products.getProductById(productId);
    let productAlreadyInCart = selectedCart.products.find(
      (product) => product.id === productId
    );
    if (productAlreadyInCart) {
      productAlreadyInCart.amount++;
      await this.writeCarts(carts);
      return "Product amount updated";
    } else {
      selectedCart.products.push({ id: productId, amount: 1 });
      await this.writeCarts(carts);
      return "Product added to cart";
    }
  };
}

export { CartManager };
