import { Request, Response } from "express";
import { createProduct, deleteProduct, getProductByCategory, getProductById, getProducts, updateProduct } from "../models/products";
import HttpStatus from "http-status-codes";
import { log } from "console";


export const getProductsByCategoryControllers = async (req: Request, res: Response) => {

  const category = req.params.name;

  try {
    const products = await getProductByCategory(category);
    if(!products){
      res.status(HttpStatus.BAD_REQUEST)
    }
    res.status(HttpStatus.OK).json(products)
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Server is not responding"})
  }
}

export const getProductsControllers = async (req: Request, res: Response) => {
  try {
    const products = await getProducts();
    if(!products){
      res.status(HttpStatus.BAD_REQUEST)
    }
    res.status(HttpStatus.OK).json(products)
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Server is not responding"})
  }
}

export const getProductByIdControllers = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const product = await getProductById(id);
    if(!product){
      res.status(HttpStatus.NOT_FOUND)
    }
    res.status(HttpStatus.OK).json(product)
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Server is not responding"})
  }
}

export const createProductControllers = async (req: Request, res: Response) => {
  try {
    const {body} = req;
    const newProduct = await createProduct(body);
    if(!newProduct) {
      res.status(HttpStatus.BAD_REQUEST)
    }
    res.status(HttpStatus.CREATED).json(newProduct)
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Server is not responding"})
  }
}

export const updateProductControllers = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const {body} = req
    const product = await updateProduct(id, body);
    if(!product) {
      res.status(HttpStatus.BAD_REQUEST)
    }
    res.status(HttpStatus.OK).json(product)
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Server is not responding"})
  }
}

export const deleteProductById = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const product = await deleteProduct(id);
    if(!product) {
      res.status(HttpStatus.BAD_REQUEST)
    }
    res.status(HttpStatus.OK).json(product)
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Server is not responding"})
  }
}