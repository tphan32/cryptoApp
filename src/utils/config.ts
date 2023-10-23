import dotenv from "dotenv";
//For env File
dotenv.config();

const { PORT, HOSTNAME, KEY, SALT, ALGORITHM, PATH_TO_SECRET } = process.env;

export default {
    hostname: HOSTNAME || "localhost",
    port: PORT || 8000,
    key: KEY as string,
    salt: SALT as string,
    algorithm: ALGORITHM as string,
    pathToSecret: PATH_TO_SECRET as string
};
