import mongoose from 'mongoose';
import { Types } from 'mongoose';
const { Schema, model } = mongoose;

export interface IProduct {
  _id?: Types.ObjectId; 
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  color: string;
  ram: number;
  rating: number;
  isStock: boolean
}

const schema = new Schema<IProduct>({
  name: String,
  description: String,
  image: String,
  price: Number,
  category: String,
  color: String,
  ram: Number,
  rating: Number,
  isStock: Boolean,
});

export const Product = model('Product', schema);


export const getProducts = () => Product.find(); 
export const getProductsForUser = (productIds: string[]) => Product.find({ _id: { $in: productIds } })
export const getProductById = (_id: string) => Product.findById({_id})
export const getProductByCategory = (category: string) => Product.find({category})
export const createProduct = (values: Record<string, any>) => new Product(values).save().then((product) => product);
export const updateProduct = (id: string, values: Record<string, any>) => Product.findByIdAndUpdate(id, values)
export const deleteProduct = (_id: string) => Product.deleteOne({_id})