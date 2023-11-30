import { Router } from "express";
import { ProductManager } from "../controllers/ProductManager.js";

const ProductRouter = Router();

const manager = new ProductManager();

ProductRouter.get("/", async (req, res) => {
  try {
    let limit = req.query.limit;
    let products = await manager.getProducts();
    if (!limit) return res.send(products);
    let productsLimited = products.filter(
      (product) => products.indexOf(product) < Number(limit)
    );
    res.send(productsLimited);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

ProductRouter.get("/:pid", async (req, res) => {
  try {
    let id = req.params.pid;
    let result = await manager.getProductById(id);
    res.send(result);
  } catch (error) {
    req.status(400).send(error.message);
  }
});

ProductRouter.post("/", async (req, res) => {
  try {
    let product = req.body;
    let result = await manager.addProduct(product);
    res.send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

ProductRouter.put("/:pid", async (req, res) => {
  try {
    let productId = req.params.pid;
    let productData = req.body;
    let result = await manager.updateProduct(productId, productData);
    res.send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

ProductRouter.delete("/:pid", async (req, res) => {
  try {
    let productId = req.params.pid;
    let result = await manager.deleteProduct(productId);
    res.send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export { ProductRouter };
