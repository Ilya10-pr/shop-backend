import {Router } from "express";
import { 
  updateAmountUserController
} from "../controllers/user";
import passport from "passport";

export const user = Router();

user.post("/amount",passport.authenticate('jwt', { session: false }), updateAmountUserController)