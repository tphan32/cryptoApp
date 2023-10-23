import express, { Express, NextFunction, Request, Response } from "express";
import Crypto from "./src/controllers/SecretController";
import config from "./src/utils/config";

const app: Express = express();

app.use(express.json());

app.get("/health", (_: Request, res: Response) => {
    res.send("OK");
});

app.post("/store", Crypto.storeSecret);

app.post("/validate", Crypto.validateSecret);

app.listen(config.port, () => {
    console.log(`Server is started at http://${config.hostname}:${config.port}`);
});
