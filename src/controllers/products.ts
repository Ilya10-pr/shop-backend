import { Request, Response } from "express";
import { createProduct, deleteProduct, getProductByOption, getProductById, getProducts, Product, updateProduct } from "../models/products";
import HttpStatus from "http-status-codes";

export const getProductsByOptionControllers = async (req: Request, res: Response) => {
  const { name, color, ram } = req.query;

  if (!name || !color || !ram) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: 'Missing required parameters: name, color, ram' });
    return
  }

  const ramNumber = +ram;
  if (isNaN(ramNumber)) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid ram value. Ram must be a number.' });
    return
  }
 
  try {
    const products = await getProductByOption(name as string);
    if (!products || products.length === 0) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'No products found with the given name.' });
    }

    const product = products.find((item) => item.ram === ramNumber && item.color === color);
    if (!product) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'No product found with the given color and ram.' });
    }
    res.status(HttpStatus.OK).json(product);
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server is not responding' });
  }
};

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
    const data = req.body
    if(data.value){
      const updateProduct = await getProductById(id)
      if(updateProduct){
        updateProduct.rating = updateProduct.rating === 0 ? data.value : Math.floor(((updateProduct.rating + data.value) / 2) * 10) / 10
        await updateProduct.save()
        res.status(HttpStatus.OK).json(updateProduct)
        return
      }
    }
    await updateProduct(id, data);
    const product = await getProducts()
    if(!product) {
      res.status(HttpStatus.BAD_REQUEST)
    }
    console.log(product)
    res.status(HttpStatus.OK).json(product)
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Server is not responding"})
  }
}

export const deleteProductById = async (req: Request, res: Response) => {
  const {id} = req.params;
  try {
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

export const addCountBuyProductController = async (req: Request, res: Response) => {
  const {id} = req.params;
  try {
    const product = await getProductById(id);
    if(!product?.countBuy) {
      res.status(HttpStatus.BAD_REQUEST)
      return
    }
    product.countBuy += 1
    product.save()
    res.status(HttpStatus.OK).json(product)
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Server is not responding"})
  }
}


export const getProductsByBrand = async (req: Request, res: Response) => {
  const {brand} = req.params
  try {
    const products = await Product.find({brand: brand });
    if(!products){
      res.status(HttpStatus.BAD_REQUEST)
      return
    }
    res.status(HttpStatus.OK).json(products)
  } catch (error) {
    console.log(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "Server is not responding"})
  }
}

