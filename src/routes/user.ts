import {Router } from "express";
import { 
  updateUserController
} from "../controllers/user";
import passport from "passport";

export const user = Router();

user.post("/amount",passport.authenticate('jwt', { session: false }), updateUserController)