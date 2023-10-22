import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import Crypto from "./src/controllers/SecretController";
import { scryptSync } from "crypto";

//For env File
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;
const host = process.env.HOST;

const preprocess = (req: Request, _: Response, next: NextFunction) => {
    const algorithm = process.env.ALGORITHM as string;
    const key: Buffer = scryptSync(
        process.env.KEY as string,
        process.env.SALT as string,
        32
    );
    req.body = { ...req.body, algorithm, key };
    next();
};

app.use(express.json());
app.use(preprocess);

app.get("/health", (_: Request, res: Response) => {
    res.send("OK");
});

app.post("/store", Crypto.storeSecret);

app.post("/validate", Crypto.validateSecret);

app.listen(port, () => {
    console.log(`Server is started at http://${host}:${port}`);
});
