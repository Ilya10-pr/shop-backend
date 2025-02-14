import { Request, Response } from "express";
import { getUserById, IUser } from "../models/users";
import HttpStatus from "http-status-codes";


export const updateUserController = async(req: Request, res: Response) => {
  const {id} = <IUser>req.user
  const {amount} =  req.body;

  try {
    const user = <IUser> await getUserById(id);

    if(!user) {
      res.status(404).json({message: 'User not found'});
    }
    user.amount += +amount
    user.save()
    res.status(HttpStatus.OK).json(user);
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Server is not responding"})
  }
}