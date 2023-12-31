import fs from "fs";
import config from "../utils/config";

const writeToFile = (content: string) => {
    const logPrefix = "FileService.writeToFile";
    try {
        fs.writeFileSync(config.pathToSecret, content);
        console.info(logPrefix + ": Wrote data to secret.txt");
    } catch (e) {
        console.error(logPrefix + ": Encountered error " + e);
        throw e;
    }
};

const readFromFile = (): string => {
    const logPrefix = "FileService.readFromFile";
    try {
        const content = fs.readFileSync(config.pathToSecret, "utf8");
        console.debug(logPrefix + ": Read content " + content);
        return content;
    } catch (e) {
        console.error(logPrefix + ": Encountered error " + e);
        throw e;
    }
};

export default {
    writeToFile,
    readFromFile,
};
