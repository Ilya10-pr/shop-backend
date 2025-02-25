import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export interface ICart {
  userId: string;
  productsCart: string[],
}

const cartSchema = new Schema<ICart>({
  userId: String,
  productsCart: [String],

});

export const Cart = model("Cart", cartSchema);


export const getProductsFromCart = (id: string) => Cart.findOne({userId: id}); 
export const addProductToCart = (values: ICart) => new Cart(values).save().then((product) => product.productsCart);
export const updateCart = (userId: string, productId: string, config: boolean ) => Cart.findOneAndUpdate({ userId },{ $push: { productsCart: productId } },{ new: config });