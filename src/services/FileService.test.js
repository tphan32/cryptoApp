import FileService from "./FileService";

describe("FileService", () => {
    beforeEach(() => jest.restoreAllMocks());

    describe("writeToFile", () => {
        it("should call fs.writeFileSync with valid arguments", () => {
            const actualFs = jest.requireActual("fs");
            const spiedFsWriteFileSync = jest
                .spyOn(actualFs, "writeFileSync")
                .mockImplementation(jest.fn());
            FileService.writeToFile("test");
            expect(spiedFsWriteFileSync).toBeCalledWith("secret.txt", "test");
        });

        it("should throw error when fs.writeFileSync throws error", () => {
            const actualFs = jest.requireActual("fs");
            jest.spyOn(actualFs, "writeFileSync").mockImplementation(() => {
                throw new Error("error");
            });
            expect(() => FileService.writeToFile("test")).toThrow();
        });
    });

    describe("readFromFile", () => {
        it("should return the content of the secret file", () => {
            const actualFs = jest.requireActual("fs");
            jest.spyOn(actualFs, "readFileSync").mockReturnValue("test");
            expect(FileService.readFromFile()).toEqual("test");
        });

        it("should throw error when fs.readFileSync throws error", () => {
            const actualFs = jest.requireActual("fs");
            jest.spyOn(actualFs, "readFileSync").mockImplementation(() => {
                throw new Error("error");
            });
            expect(() => FileService.readFromFile()).toThrow();
        });
    });
});
