import mongoose from 'mongoose';
import { Types } from 'mongoose';
const { Schema, model } = mongoose;

export interface IProduct {
  _id?: Types.ObjectId; 
  name: string;
  description: string;
  image: string;
  price: number;
  brand: string;
  color: string;
  ram: number;
  rating?: number;
  isStock: boolean;
  countBuy?: number;
}

export const productSchema = new Schema<IProduct>({
  name: String,
  description: String,
  image: String,
  price: Number,
  brand: String,
  color: String,
  ram: Number,
  rating: {type: Number, default: 0},
  isStock: Boolean,
  countBuy: {type: Number, default: 0}
});

export const Product = model("Product", productSchema);


export const getProducts = () => Product.find(); 
export const getProductsForUser = (productId: string[]) => Product.find({ _id: { $in: productId } })
export const getProductById = (_id: string) => Product.findById({_id})
export const getProductByOption = (name: string) => Product.find({name})
export const createProduct = (values: Record<string, any>) => new Product(values).save().then((product) => product);
export const updateProduct = (_id: string, values: Record<string, any>) => Product.findByIdAndUpdate(_id, values)
export const deleteProduct = (_id: string) => Product.deleteOne({_id})