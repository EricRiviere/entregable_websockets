import fs from "fs";
import { nanoid } from "nanoid";

class ProductManager {
  constructor() {
    this.path = "./src/models/products.json";
    if (fs.existsSync(this.path)) {
      let products = fs.readFileSync(this.path, "utf-8");
      this.products = JSON.parse(products);
    } else {
      this.products = [];
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, "t"));
    }
  }

  getProducts = async () => {
    let products = await fs.promises.readFile(this.path, "utf-8");
    return JSON.parse(products);
  };

  writeProducts = async (products) => {
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, "\t")
    );
  };

  addProduct = async ({
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails,
  }) => {
    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !stock ||
      !category ||
      !thumbnails
    ) {
      throw new Error("Error adding product. Missing property");
    } else {
      let products = await this.getProducts();
      let productExist = products.find((product) => product.code === code);
      if (productExist) {
        throw new Error(
          `Product with code ${productExist.code} already exists`
        );
      } else {
        let productId = nanoid(10);
        let newProduct = {
          id: productId,
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          thumbnails,
        };
        products.push(newProduct);
        await this.writeProducts(products);
        return "Product added to product list.";
      }
    }
  };

  getProductById = async (id) => {
    let products = await this.getProducts();
    let productById = products.find((product) => product.id === id);
    if (!productById) {
      throw new Error(`No product found with Id: ${id}`);
    } else {
      return productById;
    }
  };

  deleteProduct = async (id) => {
    let products = await this.getProducts();
    let productToDelete = products.find((product) => product.id === id);
    if (!productToDelete) {
      throw new Error(`No product to delete with Id: ${id}`);
    } else {
      let newProducts = products.filter((product) => product.id !== id);
      await this.writeProducts(newProducts);
      return "Product deleted from product list";
    }
  };

  updateProduct = async (id, updateData) => {
    let products = await this.getProducts();
    let productToUpdate = products.find((product) => product.id === id);
    if (!productToUpdate) {
      throw new Error(`No product to update with Id: ${id}`);
    } else {
      for (const key in updateData) {
        if (Object.prototype.hasOwnProperty.call(updateData, key)) {
          productToUpdate[key] = updateData[key];
        } else {
          throw new Error(`Invaliv propderty`);
        }
        let oldProducts = products.filter((product) => product.id !== id);
        let newProducts = [...oldProducts, { id, ...productToUpdate }];
        await this.writeProducts(newProducts);
        return "Product updated";
      }
    }
  };

  filterProducts = (id) => {
    filter((product) => product.id !== id);
  };
  findProduct = (id) => {
    find((product) => product.id === id);
  };
}

export { ProductManager };
