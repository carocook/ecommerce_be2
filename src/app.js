import dotenv from "dotenv";

dotenv.config();

import express from "express";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import productsRouter from "./routers/products.routes.js";
import cartsRouter from "./routers/carts.routes.js";
import viewsRouter from "./routers/views.routes.js";
import sessionsRouter from "./routers/sessions.routes.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import passport from "passport";
import cookieParser from "cookie-parser";
import initializePassport from "./config/passport.config.js";

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

initializePassport();

app.use(passport.initialize());

// ROUTERS
app.use("/api/sessions", sessionsRouter);

app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);

app.use("/", viewsRouter);

// STATIC
app.use(express.static(__dirname + "/public"));

// HANDLEBARS
app.engine("handlebars", handlebars.engine());

app.set("view engine", "handlebars");

app.set("views", __dirname + "/views");

// SERVER
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("conectado a DB");

    const httpServer = app.listen(process.env.PORT, () => {
      console.log(`server escuchando en ${process.env.PORT}`);
    });

    // SOCKET
    const socketServer = new Server(httpServer);

    socketServer.on("connection", (socket) => {});

    app.set("socketServer", socketServer);
  })
  .catch((error) => {
    console.log("Error conectando MongoDB");

    console.log(error);
  });
