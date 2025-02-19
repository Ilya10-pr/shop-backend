import { model, Schema } from "mongoose";

export interface IComment {
  userId: string;
  productId: string;
  avatar: string;
  firstName:string;
  countStar?: number;
  text: string;
  isAdmin: boolean;
  createdAt?: Date,
  updatedAt?: Date,
}


export const commentSchema = new Schema<IComment>({
  userId: String,
  productId: String,
  avatar: String,
  firstName:String,
  countStar: Number,
  text: String,
  isAdmin: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const Comments = model("Comments", commentSchema)