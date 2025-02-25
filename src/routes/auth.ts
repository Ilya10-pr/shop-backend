import {Router } from "express";
import { 
  authMeControllers, 
  loginUserControllers, 
  registerUserControllers,
} from "../controllers/auth";
import passport from "passport";

export const authUser = Router();

authUser.get("/me", passport.authenticate('jwt', { session: false }), authMeControllers)
authUser.post("/register", registerUserControllers)
authUser.post("/login", loginUserControllers)

