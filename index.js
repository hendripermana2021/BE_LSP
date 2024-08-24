import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/index.js";
dotenv.config();
const app = express();
import bodyParser from "body-parser";
import path from "path";

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(router);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({}));
app.use("/image", express.static("uploads/image"));

const { PORT = 8000 } = process.env;

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
const ServerMain = app.listen;
export default ServerMain;
