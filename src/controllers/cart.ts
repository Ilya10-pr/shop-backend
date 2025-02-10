import { Request, Response } from "express"
import { addProductToCart, Cart, deleteProductFromCart, getProductsFromCart } from "../models/cart"
import HttpStatus from "http-status-codes";
import { getUserById, IUser } from "../models/users";
import { getProductById, getProductsForUser } from "../models/products";
import { userInfo } from "os";


export const getProductFormCartController = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user as IUser;
    const productsUser = await getProductsFromCart(_id);
    if (!productsUser) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: "Products not found" })
    }
    res.status(HttpStatus.OK).json(productsUser?.productsCart)
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
    const existingCart = await getProductsFromCart(user.id);
    const dataUser = await getUserById(user.id);
    if (dataUser) {
      dataUser.productCount = (dataUser.productCount || 0) + 1;
      await dataUser.save()
    }
    if (!existingCart) {
        const newCart = await addProductToCart({
          userId: user.id,
          productsCart: product,
        })
        res.status(HttpStatus.OK).json(newCart?.productsCart)
        return
    }
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: user.id },
      { $push: { productsCart: product } },
      { new: true }
    );
    res.status(HttpStatus.OK).json(updatedCart?.productsCart)
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
        const dataUser = await getUserById(user.id);
        if (dataUser) {
          dataUser.productCount = (dataUser.productCount || 0) - 1;
          await dataUser.save()
        }
        cart.productsCart.splice(indexToRemove, 1);
        await cart.save();
        res.status(HttpStatus.OK).json(cart.productsCart)
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