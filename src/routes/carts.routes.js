import { Router } from "express";
import { CartManager } from "../controllers/CartManager.js";
import { ProductManager } from "../controllers/ProductManager.js";

const CartsRouter = Router();

const Cmanager = new CartManager();
const Pmanager = new ProductManager();

CartsRouter.get("/", async (req, res) => {
  try {
    let carts = await Cmanager.getCarts();
    res.send(carts);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

CartsRouter.get("/:cid", async (req, res) => {
  try {
    let cartId = req.params.cid;
    let cart = await Cmanager.getCartById(cartId);
    res.send(cart);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

CartsRouter.post("/", async (req, res) => {
  try {
    let result = await Cmanager.addCart();
    res.send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

CartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    let result = await Cmanager.addProductToCart(cartId, productId);
    res.send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export { CartsRouter };
