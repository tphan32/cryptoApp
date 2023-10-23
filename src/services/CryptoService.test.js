import config from "../utils/config";
import CryptoService from "./CryptoService";

describe("CryptoService", () => {
    const actualCryptoModule = jest.requireActual('crypto');
    const mockBytes = Buffer.from('123');
    const mockIv = Buffer.from('1234567891234567');
    const mockKey = Buffer.from('12345678912345671234567891234567');

    beforeEach(() => {
        jest.restoreAllMocks(),
        jest.clearAllMocks()
    })

    describe("encrypt", () => {
        it("should return the encrypted data when calling with valid arguments", () => {
            jest.spyOn(actualCryptoModule, 'createCipheriv').mockImplementation(() => {
                return {
                    update: jest.fn().mockReturnValue(mockBytes),
                    final: jest.fn().mockReturnValue(mockBytes)
                }
            });
            jest.spyOn(actualCryptoModule, 'randomBytes').mockReturnValue(mockIv)
            const encrypted = CryptoService.encrypt("secret");
            expect(encrypted).toEqual(mockIv.toString('hex') + "." + mockBytes.toString('hex') + mockBytes.toString('hex'))
        });

        it("should call encryption functions with proper arguments", () => {
            jest.spyOn(actualCryptoModule, 'randomBytes').mockReturnValue(mockIv);
            const spiedScryptSync = jest.spyOn(actualCryptoModule, 'scryptSync').mockReturnValue(mockKey);
            const spiedCreateCipheriv = jest.spyOn(actualCryptoModule, 'createCipheriv');
            CryptoService.encrypt("secret");
            expect(spiedScryptSync).toBeCalledWith(config.key, config.salt, 32);
            expect(spiedCreateCipheriv).toBeCalledWith(config.algorithm, mockKey, mockIv);
        });

        it('should throw error when createCipherIv throws error', () => {
            jest.spyOn(actualCryptoModule, 'createCipheriv').mockImplementation(() => { throw new Error("error") });
            expect(() => CryptoService.encrypt("secret")).toThrow();
        })
    });

    describe("decrypt", () => {
        it("should return decrypted data when calling with valid arguments", () => {
            const decrypted = CryptoService.decrypt(
                "aaed36bc3eff566e8c4d340b97e08619.cda5b8355d2bbb2d390a293196415557",
            );
            expect(decrypted).toEqual("secret");
        });

        it("should call decryption functions with proper arguments", () => {
            const spiedScryptSync = jest.spyOn(actualCryptoModule, 'scryptSync').mockReturnValue(mockKey);
            const spiedCreateDecipheriv = jest.spyOn(actualCryptoModule, 'createDecipheriv').mockImplementation(() => {
                return {
                    update: jest.fn().mockReturnValue(mockBytes),
                    final: jest.fn().mockReturnValue(mockBytes)
                }
            });
            CryptoService.decrypt("aaed36bc3eff566e8c4d340b97e08619.cda5b8355d2bbb2d390a293196415557");
            expect(spiedScryptSync).toBeCalledWith(config.key, config.salt, 32);
            expect(spiedCreateDecipheriv).toBeCalledWith(config.algorithm, mockKey, Buffer.from('aaed36bc3eff566e8c4d340b97e08619', 'hex'));
        });

        it("should throw error when createDecipheriv throws error", () => {
            jest.spyOn(actualCryptoModule, 'createDecipheriv').mockImplementation(() => { throw new Error("error") });
            expect(() => CryptoService.decrypt("4e3a7447881104244faedd7880cdb788.6ce826b3e97deba90ce227df04f11801")).toThrow();
        });

        it("should throw error when calling with invalid encrypted data", () => {
            expect(() => CryptoService.decrypt("4e3a7447881104244faedd7880cdb788")).toThrow();
        });
    });
});
