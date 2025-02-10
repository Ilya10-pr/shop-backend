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


export const getProductsFromCart = (id: string) => Cart.findOne({userId: id}); 
export const addProductToCart = (values: ICart) => new Cart(values).save().then((product) => product);
export const deleteProductFromCart = (userId: string, productId: string ) => Cart.deleteOne({userId, productId}, {productsCart: 1, _id: 0})