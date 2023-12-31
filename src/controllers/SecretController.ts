import { Request, Response } from "express";
import CryptoService from "../services/CryptoService";
import FileService from "../services/FileService";

const storeSecret = async (req: Request, res: Response) => {
    const logPrefix = "SecretController.storeSecret";
    const { secret } = req.body;

    try {
        const encryptedData = CryptoService.encrypt(secret);
        if (encryptedData) {
            FileService.writeToFile(encryptedData);
            console.info(logPrefix + ": Successfully stored the secret");
            return res.send({ encryptedData });
        }
    } catch (e) {
        console.error(logPrefix + ": Encountered error " + e);
    }

    res.status(500).send("Internal Server Error");
};

const validateSecret = async (req: Request, res: Response) => {
    const logPrefix = "SecretController.validateSecret";
    const { secretFromRequest } = req.body;

    try {
        const encryptedDataFromFile = FileService.readFromFile();
        const secretFromFile = CryptoService.decrypt(encryptedDataFromFile);
        console.info(logPrefix + ": Successfully verified the secret");
        return res.send({
            secretMatched: secretFromRequest === secretFromFile,
        });
    } catch (e) {
        console.error(logPrefix + ": Encountered error " + e);
    }

    res.status(500).send("Internal Server Error");
};

export default {
    storeSecret,
    validateSecret,
};
