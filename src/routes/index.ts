import {Router} from "express";
import {authUser} from "./auth";
import { products } from "./products";
import { cart } from "./cart";


export const router = Router();

router.use("/auth",  authUser);
router.use("/products", products)
router.use("/cart", cart)