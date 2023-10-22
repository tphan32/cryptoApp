import crypto from "crypto";

const encrypt = (secret: string, algorithm: string, key: Buffer): string => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedData = cipher.update(secret);
    encryptedData = Buffer.concat([encryptedData, cipher.final()]);
    return iv.toString("hex") + "." + encryptedData.toString("hex");
};

const decrypt = (
    encryptedData: string,
    algorithm: string,
    key: Buffer
): string => {
    const [iv, encryptedSecret] = encryptedData.split(".");
    const decipher = crypto.createDecipheriv(
        algorithm,
        key,
        Buffer.from(iv, "hex")
    );
    let secret = decipher.update(Buffer.from(encryptedSecret, "hex"));
    secret = Buffer.concat([secret, decipher.final()]);
    return secret.toString();
};

export default {
    encrypt,
    decrypt,
};
