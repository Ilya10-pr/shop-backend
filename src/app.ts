import express, {Express} from "express";
import dotenv from "dotenv";
import cors from "cors";
import {router} from "./routes/index";
import mongoose from "mongoose"
import {keys} from "./config/keys"
import {strategyPassport} from "./middleware/passport";
dotenv.config();

const app = express();
const jsonBodyMiddleware = express.json();
// app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(jsonBodyMiddleware);
app.use(strategyPassport.initialize());
app.use(cors({
  origin: 'http://localhost:5173', // Разрешаем запросы только с этого домена
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Разрешаем методы
  allowedHeaders: ['Content-Type', 'Authorization'], // Разрешаем заголовки
}));
app.use(router); 


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

