import { Request, Response } from "express";
import { createUser, getUserByEmail, getUserById, IUser } from "../models/users";
import HttpStatus from "http-status-codes";
import { createToken } from "../config/createToken";


export const authMeControllers = async (req: Request, res: Response) => {
  const {id} = <IUser>req.user
  try {
    const user = await getUserById(id);
    if(!user){
      res.status(HttpStatus.NOT_FOUND).json({message: "User not found"})
    }

    res.status(HttpStatus.OK).json(user)
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Server is not responding"})
  }
}



export const registerUserControllers = async (req: Request, res: Response) => {
   try {
      const {firstName, lastName, email, password} =  req.body;
      console.log(req.body)
      const candidate = await getUserByEmail(email);
      if (candidate) {
         res.status(HttpStatus.BAD_REQUEST).json({message: "User with this email already exists"});
      }
      const newUser = await createUser({
         firstName,
         lastName,
         email,
         password
      })
      const user = createToken(newUser)
      res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Server is not responding"})
    }
}


export const loginUserControllers = async(req: Request, res: Response) => {

  try {
    const {email, password} =  req.body;
    const candidate = <IUser> await getUserByEmail(email);

    if(!candidate) {
      res.status(404).json({message: 'User not found'});
    }
    const isCorrected = await candidate.comparePassword(password);
    if (isCorrected) {
      const user = createToken(candidate)
      res.status(HttpStatus.OK).json(user);
    }
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Server is not responding"})
  }
}