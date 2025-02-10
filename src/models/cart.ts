import mongoose from 'mongoose';
import { IProduct, productSchema } from './products';
const { Schema, model } = mongoose;

export interface ICart {
  userId: string;
  productsCart: IProduct[],
}

const cartSchema = new Schema<ICart>({
  userId: String,
  productsCart: [productSchema],

});

export const Cart = model("Cart", cartSchema);


export const getProductsFromCart = (id: string) => Cart.find({userId: id}, {productsCart: 1}); 
export const addProductToCart = (values: Record<string, any>) => new Cart(values).save().then((product) => product);
export const deleteProductFromCart = (userId: string, productId: string ) => Cart.deleteOne({userId, productId})