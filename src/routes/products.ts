import { Router } from "express";
import { 
  createProductControllers, 
  deleteProductById, 
  getProductByIdControllers, 
  getProductsControllers, 
  updateProductControllers,
  getProductsByCategoryControllers
} from "../controllers/products";

export const products = Router()

products.get("/category/:name", getProductsByCategoryControllers)
products.get("/", getProductsControllers)
products.get("/:id", getProductByIdControllers)
products.post("/", createProductControllers)
products.put("/:id", updateProductControllers)
products.delete("/:id", deleteProductById)