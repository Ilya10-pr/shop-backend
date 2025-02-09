import { Router } from "express";
import { addProductToCartController, deleteProductFromCartController, getProductFormCartController } from "../controllers/cart";
import passport from "passport";



export const cart = Router();


cart.get("/", passport.authenticate('jwt', { session: false }), getProductFormCartController);
cart.post("/",passport.authenticate('jwt', { session: false }), addProductToCartController);
cart.delete("/:id", passport.authenticate('jwt', { session: false }), deleteProductFromCartController);