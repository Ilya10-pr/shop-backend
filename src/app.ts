import express, {Express} from "express";
import dotenv from "dotenv";
import cors from "cors";
import {router} from "./routes/index";
import mongoose from "mongoose"
import {keys} from "./config/keys"
import {strategyPassport} from "./middleware/passport";
import expressWs from "express-ws";
import { Comments } from "./models/comments";
dotenv.config();



const jsonBodyMiddleware = express.json();
const appWs = expressWs(express());

const app = appWs.app


app.use(express.static("public"));
app.use(jsonBodyMiddleware);
app.use(strategyPassport.initialize());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(router); 

app.ws("/ws/comments", (ws, req) => {
  console.log("Новое WebSocket соединение установлено");

  Comments.find({})
    .then((comments) => {
      ws.send(JSON.stringify({ type: "INIT_COMMENTS", data: comments }));
    })
    .catch((err) => {
      console.error("Ошибка при загрузке комментариев:", err);
    });

  ws.on("message", async (message: string) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case "ADD_COMMENT": {
        const newComment = new Comments(data.payload);
        await newComment.save();

        appWs.getWss().clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(JSON.stringify({ type: "NEW_COMMENT", data: newComment }));
          }
        });
        break;
      }

      case "EDIT_COMMENT": {
        const { commentId, text } = data.payload;
        const updatedComment = await Comments.findByIdAndUpdate(
          commentId,
          { text, updatedAt: new Date() },
          { new: true }
        );

        appWs.getWss().clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(JSON.stringify({ type: "UPDATED_COMMENT", data: updatedComment }));
          }
        });
        break;
      }

      case "DELETE_COMMENT": {
        const { commentId } = data.payload;
        await Comments.findByIdAndDelete(commentId);

        appWs.getWss().clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(JSON.stringify({ type: "DELETED_COMMENT", data: { commentId } }));
          }
        });
        break;
      }

      default:
        console.log("Неизвестный тип сообщения:", data.type);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket соединение закрыто");
  });
});




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

