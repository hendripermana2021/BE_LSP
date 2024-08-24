import express from "express";
import router from "./routes/index.js";
import morgan from "morgan";
import { MORGAN_FORMAT } from "./config/application.js";
const app = express();
import bodyParser from "body-parser";

app.use(express.json());
app.use(router);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({}));

app.use(morgan(MORGAN_FORMAT));

export default app;
