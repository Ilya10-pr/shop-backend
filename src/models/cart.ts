import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export interface ICart {
  userId: string;
  productId: string;
}

const schema = new Schema<ICart>({
  userId: String,
  productId: String,

});

export const Cart = model('Cart', schema);


export const getProductsFromCart = (id: string) => Cart.find({userId: id}); 
export const addProductToCart = (values: Record<string, any>) => new Cart(values).save().then((product) => product);
export const deleteProductFromCart = (userId: string, productId: string ) => Cart.deleteMany({userId, productId})