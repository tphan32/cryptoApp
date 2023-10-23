import SecretController from "./SecretController";
import CryptoService from "../services/CryptoService";
import createMockTestSuite from '../utils/testHelper';

const encryptedData = "encryptedData";
const decryptedData = "decryptedData";

jest.mock("../services/CryptoService.ts");

jest.mock("../services/FileService.ts", () => {
    return {
        ...jest.requireActual("../services/FileService"),
        writeToFile: jest.fn(),
        readFromFile: jest.fn().mockReturnValue(encryptedData)
    };
});

describe("SecretController", () => {
    const secretFromRequest = decryptedData;
    const secret = "secret";
    const algorithm = "algorithm";
    const key = "key";
    const { mockStatus, mockRes, mockSend } = createMockTestSuite();

    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    })

    describe("storeSecret", () => {
        const mockReq = { body: { secret, algorithm, key } };
        it("should return encrypted data when calling with valid arguments", async () => {
            CryptoService.encrypt.mockReturnValue(encryptedData);
            await SecretController.storeSecret(mockReq, mockRes);
            expect(mockSend).toBeCalledWith({ encryptedData });
        });


        it("should call CryptoService.encrypt with proper arguments", async () => {
            const spiedCryptoServiceEncrypt = jest.spyOn(
                CryptoService,
                "encrypt"
            ).mockReturnValue(encryptedData);
            await SecretController.storeSecret(mockReq, mockRes);
            expect(spiedCryptoServiceEncrypt).toBeCalledWith(
                secret,
                algorithm,
                key
            );
        });

        it("should return status 500 and Internal Server Error when encountering error", async () => {
            CryptoService.encrypt.mockReturnValue(null);
            await SecretController.storeSecret(mockReq, mockRes);
            expect(mockStatus).toBeCalledWith(500);
            expect(mockSend).toBeCalledWith("Internal Server Error");
        });
    });

    describe("validateSecret", () => {
        const mockReq = { body: { secretFromRequest, algorithm, key } };
        it('should return true when incoming secret matches the stored secret', async () => {
            CryptoService.decrypt.mockReturnValue(decryptedData);
            await SecretController.validateSecret(mockReq, mockRes);
            expect(mockSend).toBeCalledWith({ secretMatched: true });
        })

        it('should return false when incoming secret does not matche the stored secret', async () => {
            CryptoService.decrypt.mockReturnValue('notMatchedSecret');
            await SecretController.validateSecret(mockReq, mockRes);
            expect(mockSend).toBeCalledWith({ secretMatched: false });
        })

        it('should call CryptoService.decrypt with proper arguments', async () => {
            const spiedCryptoServiceDecrypt = jest.spyOn(
                CryptoService,
                "decrypt"
            ).mockReturnValue(decryptedData);
            await SecretController.validateSecret(mockReq, mockRes);
            expect(spiedCryptoServiceDecrypt).toBeCalledWith(
                encryptedData,
                algorithm,
                key
            );
        })

        it("should return status 500 and Internal Server Error when encountering error", async () => {
            CryptoService.decrypt.mockImplementation(() => { throw new Error("error") });
            await SecretController.validateSecret(mockReq, mockRes);
            expect(mockStatus).toBeCalledWith(500);
            expect(mockSend).toBeCalledWith("Internal Server Error");
        });
    });
});
