import { model, Schema } from "mongoose";

export interface IComment {
  productId: string;
  avatar: string;
  firstName:string;
  userId: string;
  countStar: number;
  description?: string;
}


export const commentSchema = new Schema<IComment>({
  productId: String,
  avatar: String,
  firstName:String,
  userId: String,
  countStar: Number,
  description: {type: String, default: "There is no comment"}
})

export const Comments = model("Comments", commentSchema)