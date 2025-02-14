import { Request, Response } from "express"
import { addProductToCart, Cart, getProductsFromCart } from "../models/cart"
import HttpStatus from "http-status-codes";
import { IUser } from "../models/users";
import {  getProductsForUser } from "../models/products";


export const getProductFromCartController = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user as IUser;
    const productsUser = await getProductsFromCart(_id);
    if (productsUser) {
      const products = await getProductsForUser(productsUser.productsCart)
      res.status(HttpStatus.OK).json(products)
      return
    }    
    res.status(HttpStatus.BAD_REQUEST).json({ message: "Products not found" })
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server is not responding" })
  }
}
 


export const addProductToCartController = async (req: Request, res: Response) => {
  const user = <IUser>req.user;
  const productId: string = req.body.productId;
  if (!user || !productId) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: "userId and productsCart are required" })
    return
  }
  try {
    const existingCart = await getProductsFromCart(user.id);
    if (!existingCart) {
        const newCart = await addProductToCart(
          {userId: user.id,
          productsCart: [productId]}
        )
        const products = await getProductsForUser(newCart)
        res.status(HttpStatus.OK).json(products)
        return 
    }
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: user.id },
      { $push: { productsCart: productId } },
      { new: true }
    );
    if(updatedCart){
      const products = await getProductsForUser(updatedCart.productsCart)
      res.status(HttpStatus.OK).json(products)
    }
    res.status(HttpStatus.BAD_REQUEST)
  } catch (error) {
    console.log(error) 
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server is not responding" })
  }
}


export const deleteProductFromCartController = async (req: Request, res: Response) => {
  try {
    const user = <IUser>req.user;
    const productId = req.params.id
    const cart = await Cart.findOne({ userId: user._id });
    if (cart) {
      cart.productsCart = cart.productsCart.filter((id) => id !== productId )
      cart.save()
      const products = await getProductsForUser(cart.productsCart)
      res.status(HttpStatus.OK).json(products)
    }
    res.status(HttpStatus.BAD_REQUEST)
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server is not responding" })
  }
}