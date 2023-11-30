import { Router } from "express";
import { ProductManager } from "../controllers/ProductManager.js";

const viewsRouter = Router();

const pManager = new ProductManager();

viewsRouter.get("/", async (req, res) => {
  let products = await pManager.getProducts();
  res.render("home", {
    title: "Home",
    cssFile: "styles.css",
    products,
  });
});

viewsRouter.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {
    title: "Real Time Products",
    cssFile: "styles.css",
  });
});

viewsRouter.get("/:pid", async (req, res) => {
  let productId = req.params.pid;
  let product = await pManager.getProductById(productId);
  res.render("product", {
    title: "Product",
    cssFile: "styles.css",
    product,
  });
});

export { viewsRouter };
