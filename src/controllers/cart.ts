import { Request, Response } from "express"
import { addProductToCart, Cart, deleteProductFromCart, getProductsFromCart } from "../models/cart"
import HttpStatus from "http-status-codes";
import { IUser } from "../models/users";
import { getProductById, getProductsForUser } from "../models/products";


export const getProductFormCartController = async (req: Request, res: Response) => {
  try {
    const user = <IUser>req.user;
    const productsUser = await getProductsFromCart(user.id);
    if (!productsUser) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: "Products not found" })
    }
    res.status(HttpStatus.OK).json(productsUser)
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server is not responding" })
  }
}



export const addProductToCartController = async (req: Request, res: Response) => {
  const user = <IUser>req.user;
  const product = req.body;
  if (!user || !product) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: "userId and productsCart are required" })
    return
  }
  try {
    const existingCart = await Cart.findOne({ userId: user._id });
    if (!existingCart) {
      const newCart = new Cart({
        userId: user._id,
        productsCart: product,
      })
      newCart.save()
      res.status(HttpStatus.OK).json(newCart)
      return
    }
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: user._id },
      { $push: { productsCart: product } },
      { new: true }
    );
    res.status(HttpStatus.OK).json(updatedCart)
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
      const indexToRemove = cart.productsCart.findIndex(
        (product) => (product._id)?.toString() === productId
      );

      if (indexToRemove !== -1) {
        cart.productsCart.splice(indexToRemove, 1);
        await cart.save();
        res.status(HttpStatus.OK).json(cart)
        return
      }
      res.status(HttpStatus.BAD_REQUEST)
      return
    }
    return
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server is not responding" })
  }
}