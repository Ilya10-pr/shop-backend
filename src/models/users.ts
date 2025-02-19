import { Document, model, Schema, Types } from 'mongoose';
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  email: string;
  password: string;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  amount: number
}


const schema = new Schema<IUser>({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  avatar: {type: String, default: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png"},
  email:  {type: String, required: true},
  password: {type: String, required: true},
  role: {type: String, default: "user"},
  amount: {type: Number, default: 0},
});


schema.pre<IUser>("save", async function( next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

schema.methods.comparePassword = function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model('User', schema);

export const getUserById = (id: string) => User.findById(id);
export const getUserByEmail = (email: string) => User.findOne({email})
export const createUser = (values: Record<string, any>) => new User(values).save().then((user) => user);
export const updateUser = (id: string, values: Record<string, any>) => User.findByIdAndUpdate(id, values)
export const deleteUser = (id: string) => User.findByIdAndDelete({_id: id})


