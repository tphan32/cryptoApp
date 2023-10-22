import crypto from "crypto";

const encrypt = (secret: string, algorithm: string, key: Buffer): string => {
    const logPrefix = "CryptoService.encrypt";

    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encryptedData = cipher.update(secret);
        encryptedData = Buffer.concat([encryptedData, cipher.final()]);
        console.info(logPrefix + ": Successfully encrypted the data");
        return iv.toString("hex") + "." + encryptedData.toString("hex");
    } catch (e) {
        console.error(logPrefix + ": Encountered error " + e);
        throw e;
    }
};

const decrypt = (
    encryptedData: string,
    algorithm: string,
    key: Buffer
): string | null => {
    const logPrefix = "CryptoService.decrypt";

    try {
        const [iv, encryptedSecret] = encryptedData.split(".");
        const decipher = crypto.createDecipheriv(
            algorithm,
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
