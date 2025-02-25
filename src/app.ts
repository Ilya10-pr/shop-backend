import dotenv from "dotenv";
import mongoose from "mongoose"
import {keys} from "./config/keys"
import { app } from "./config/createServer";
dotenv.config();


const startServer = async () => {
  try {
    await mongoose.connect(keys.mongoDb_url)
                  .then(() => console.log("MongoDB connected"))
                  .catch((err) => console.log(err))
    app.listen(process.env.API_PORT, async () => {
      console.log("Server is started");
    })
    
  } catch (error: unknown) {
    const err = error as Error;
    console.log(err.message)
  }
}

startServer()

