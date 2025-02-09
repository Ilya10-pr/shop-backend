import { Request, Response } from "express"
import { addProductToCart, deleteProductFromCart, getProductsFromCart } from "../models/cart"
import HttpStatus from "http-status-codes";
import { IUser } from "../models/users";
import { getProductsForUser } from "../models/products";


export const getProductFormCartController = async(req: Request, res: Response) => {
  try {
    const user = <IUser>req.user;
    const productsUser = await getProductsFromCart(user.id);
    if(!productsUser){
      res.status(HttpStatus.BAD_REQUEST).json({message: "Products not found"})
    }
    const arrProductId = productsUser.map((product) => product.productId);
    const products = await getProductsForUser(arrProductId)
    res.status(HttpStatus.OK).json(products)
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Server is not responding"})
  }
}



export const addProductToCartController = async(req: Request, res: Response) => {
  try {
    const user = <IUser>req.user;
    const {productId} = req.body
    if(!productId){
      res.status(HttpStatus.BAD_REQUEST)
    }
    const productCart = await addProductToCart({
      userId: user.id,
      productId: productId
    })
    if(!productCart){
      res.status(HttpStatus.BAD_REQUEST).json({message: "The product has not been added"})
      return
    }
    res.status(HttpStatus.OK).json(productCart)
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Server is not responding"})
  }
}


export const deleteProductFromCartController = async(req: Request, res: Response) => {
  try {
    const user = <IUser>req.user;
    const productId = req.params._id
    const productUser = await deleteProductFromCart(user.id, productId);
    if(productUser.deletedCount > 0){
      res.status(HttpStatus.OK).json(productUser)
    }
    res.status(HttpStatus.BAD_REQUEST)
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Server is not responding"})
  }
}