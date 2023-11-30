import express from "express";
import { ProductRouter } from "./routes/products.routes.js";
import { CartsRouter } from "./routes/carts.routes.js";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import { viewsRouter } from "./routes/views.routes.js";
import { Server } from "socket.io";
import { ProductManager } from "./controllers/ProductManager.js";

//Server
const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  `Server listening on port ${PORT}`;
});

//SocketServer
const io = new Server(httpServer);

//Product Manager
const manager = new ProductManager();

//Midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Api routers
app.use("/api/products", ProductRouter);
app.use("/api/carts", CartsRouter);

//Handlebars
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

//Static
app.use(express.static(`${__dirname}/public`));

//ViewRouter
app.use("/", viewsRouter);

//Socket
io.on("connection", async (socket) => {
  console.log("New client connected: " + socket.id);

  socket.on("productFromForm", async (data) => {
    await manager.addProduct(data);

    const updatedProducts = await manager.getProducts();

    io.emit("products_list", updatedProducts);
  });

  socket.on("deleteProduct", async (data) => {
    await manager.deleteProduct(data);

    const updatedProducts = await manager.getProducts();

    io.emit("products_list", updatedProducts);
  });

  socket.emit("products_list", await manager.getProducts());

  socket.on("disconnect", () => {
    console.log("Client disconnected: " + socket.id);
  });
});
