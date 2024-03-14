import express from "express";
import cookieSession from "cookie-session";
import { json } from "body-parser";

const app = express();

app.set("trust proxy", true); //trust traffic coming from ingress-ngnix

app.use(express.json()); // express.json() is a middleware that parses incoming requests with JSON payloads
app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV != "test",
  })
);

export { app };
