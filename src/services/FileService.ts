import fs from "fs";

const PATH_TO_SECRET = 'secret.txt';

const writeToFile = (content: string) => {
    const logPrefix = "FileService.writeToFile";
    try {
        fs.writeFileSync(PATH_TO_SECRET, content);
        console.info(logPrefix + ": Wrote data to secret.txt");
    } catch (e) {
        console.error(logPrefix + ": Encountered error " + e);
        throw e;
    }
};

const readFromFile = (): string => {
    const logPrefix = "FileService.readFromFile";
    try {
        const content = fs.readFileSync(PATH_TO_SECRET, "utf8");
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
