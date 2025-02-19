import { Request, Response, Router } from "express";
import { Comments } from "../models/comments";
import HttpStatus from "http-status-codes"

export const commentRouter = Router()


commentRouter.post("/", async (req: Request, res: Response) => {
  const commentInfo = req.body
  try {
    if(!commentInfo){
      res.status(HttpStatus.BAD_REQUEST).json({message: "There are no comment options"})
    }

    const newComment = new Comments({
        userId: commentInfo.userId,
        firstName: commentInfo.firstName,
        avatar :commentInfo.avatar,
        productId: commentInfo.productId,
        countStar: commentInfo.countStar,
        text: commentInfo.text,
        isAdmin: commentInfo.isAdmin
    })
    newComment.save()
    if(!newComment) {
      res.status(HttpStatus.CONFLICT).json({message: "Сouldn`t create comment"})
    }
    res.status(HttpStatus.OK).json(newComment)
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Server is not responding"})
  }
})