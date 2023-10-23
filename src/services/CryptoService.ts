import {
    randomBytes,
    createCipheriv,
    scryptSync,
    createDecipheriv,
} from "crypto";
import config from "../utils/config";

const encrypt = (secret: string): string => {
    const logPrefix = "CryptoService.encrypt";
    try {
        const iv = randomBytes(16);
        const key: Buffer = scryptSync(config.key, config.salt, 32);
        const cipher = createCipheriv(config.algorithm, key, iv);
        let encryptedData = cipher.update(secret);
        encryptedData = Buffer.concat([encryptedData, cipher.final()]);
        console.info(logPrefix + ": Successfully encrypted the data");
        return iv.toString("hex") + "." + encryptedData.toString("hex");
    } catch (e) {
        console.error(logPrefix + ": Encountered error " + e);
        throw e;
    }
};

const decrypt = (encryptedData: string): string => {
    const logPrefix = "CryptoService.decrypt";
    try {
        const key: Buffer = scryptSync(config.key, config.salt, 32);
        const [iv, encryptedSecret] = encryptedData.split(".");
        const decipher = createDecipheriv(
            config.algorithm,
            key,
            Buffer.from(iv, "hex")
        );
        let secret = decipher.update(Buffer.from(encryptedSecret, "hex"));
        secret = Buffer.concat([secret, decipher.final()]);
        console.info(logPrefix + ": Successfully decrypted the data");
        return secret.toString();
    } catch (e) {
        console.error(logPrefix + ": Encountered error " + e);
        throw e;
    }
};

export default {
    encrypt,
    decrypt,
};
