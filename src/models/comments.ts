import { model, Schema } from "mongoose";

export interface IComment {
  productId: string;
  avatar: string;
  firstName:string;
  countStar?: number;
  comment: string;
  isAdmin: boolean;
  createdAt?: Date,
  updatedAt?: Date,
}


export const commentSchema = new Schema<IComment>({
  productId: String,
  avatar: String,
  firstName:String,
  countStar: Number,
  comment: String,
  isAdmin: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const Comments = model("Comments", commentSchema)