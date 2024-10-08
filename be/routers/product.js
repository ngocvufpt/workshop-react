import { Router } from "express";
import {
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product";
import { createProduct } from "../controllers/product";

const router = Router();
router.get("/products", getProducts);
router.post("/products", createProduct);
router.delete("/products/:id", deleteProduct);
router.put("/products/:id", updateProduct);
router.get("/products/:id", getProductById);
export default router;
