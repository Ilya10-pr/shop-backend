import jwt from "jsonwebtoken";
import { keys } from "./keys";
import { IUser } from "../models/users";

export const createToken = (data: IUser) => {
  const payload = {id: data._id, email: data.email,role: data.role }
      const token = jwt.sign(payload, keys.secretOrKey, { expiresIn:"3h", algorithm: 'HS256'});
      const user = {
        token: 'Bearer ' + token,
        _id: data._id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        role: data.role,
        productCount: data.productCount
    }
  return user
}