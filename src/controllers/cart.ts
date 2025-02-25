import { Request, Response } from "express"
import { addProductToCart, getProductsFromCart, updateCart } from "../models/cart"
import HttpStatus from "http-status-codes";
import { IUser } from "../models/users";
import {  getProductsForCartUser } from "../models/products";


export const getProductFromCartController = async (req: Request, res: Response) => {
  const { _id } = req.user as IUser;
  try {
    const productsUser = await getProductsFromCart(_id);
    if (productsUser) {
      const products = await getProductsForCartUser(productsUser.productsCart)
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
        const products = await getProductsForCartUser(newCart)
        res.status(HttpStatus.OK).json(products)
        return 
    }
    const updatedCart = await updateCart(user.id,
      productId,
      true 
    );
    if(updatedCart){
      const products = await getProductsForCartUser(updatedCart.productsCart)
      res.status(HttpStatus.OK).json(products)
    }
    res.status(HttpStatus.BAD_REQUEST)
  } catch (error) {
    console.log(error) 
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server is not responding" })
  }
}


export const deleteProductFromCartController = async (req: Request, res: Response) => {
  const user = <IUser>req.user;
  const productId = req.params.id
  try {
    const cart = await getProductsFromCart(user._id );
    if (cart) {
      cart.productsCart = cart.productsCart.filter((id) => id !== productId )
      cart.save()
      const products = await getProductsForCartUser(cart.productsCart)
      res.status(HttpStatus.OK).json(products)
    }
    res.status(HttpStatus.BAD_REQUEST)
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server is not responding" })
  }
}