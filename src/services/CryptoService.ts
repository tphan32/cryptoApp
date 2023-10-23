import crypto from "crypto";
import config from "../utils/config";

const encrypt = (secret: string): string => {
    const logPrefix = "CryptoService.encrypt";
    const key: Buffer = crypto.scryptSync(config.key, config.salt, 32);

    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(config.algorithm, key, iv);
        let encryptedData = cipher.update(secret);
        encryptedData = Buffer.concat([encryptedData, cipher.final()]);
        console.info(logPrefix + ": Successfully encrypted the data");
        return iv.toString("hex") + "." + encryptedData.toString("hex");
    } catch (e) {
        console.error(logPrefix + ": Encountered error " + e);
        throw e;
    }
};

const decrypt = (encryptedData: string): string | null => {
    const logPrefix = "CryptoService.decrypt";

    try {
        const [iv, encryptedSecret] = encryptedData.split(".");
        const key: Buffer = crypto.scryptSync(config.key, config.salt, 32);

        const decipher = crypto.createDecipheriv(
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
