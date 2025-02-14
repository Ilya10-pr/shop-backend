import {Router} from "express";
import {authUser} from "./auth";
import { products } from "./products";
import { cart } from "./cart";
import { user } from "./user";


export const router = Router();

router.use("/auth",  authUser);
router.use("/products", products)
router.use("/cart", cart)
router.use("/user", user)