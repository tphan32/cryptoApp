import { Request, Response } from "express";
import CryptoService from "../services/CryptoService";

const storeSecret = async (req: Request, res: Response) => {
    const { secret, algorithm, key } = req.body;
    const encryptedData = CryptoService.encrypt(secret, algorithm, key);
    res.send({ encryptedData });
};

const validateSecret = async (req: Request, res: Response) => {
    const { encryptedData, algorithm, key } = req.body;
    const secret = CryptoService.decrypt(encryptedData, algorithm, key);
    res.send({ secret });
};

export default {
    storeSecret,
    validateSecret,
};
