import { Router } from "express";
import { createCommentController } from "../controllers/comments";

export const commentRouter = Router()

commentRouter.post("/", createCommentController)

