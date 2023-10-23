import { scryptSync } from "crypto";
import CryptoService from "./CryptoService";

describe("CryptoService", () => {
    describe("encrypt", () => {
        it("should return the encrypted data when calling with valid arguments", () => {
            const key = scryptSync("abc", "def", 32);
            const encrypted = CryptoService.encrypt(
                "secret",
                "aes-256-cbc",
                key
            );
            expect(encrypted).not.toBeNull();
            expect(encrypted).toContain(".");
        });

        it("should throw error when calling with invalid algorithm", () => {
            const algorithm = "non-existent-algorithm";
            const key = scryptSync("abc", "def", 32);
            expect(() =>
                CryptoService.encrypt("secret", algorithm, key)
            ).toThrow();
        });

        it("should throw error when calling with invalid key", () => {
            const key = Buffer.from("invalid-key");
            expect(() =>
                CryptoService.encrypt("secret", "aes-256-cbc", key)
            ).toThrow();
        });
    });

    describe("decrypt", () => {
        it("should return decrypted data when calling with valid arguments", () => {
            const key = scryptSync("abc", "def", 32);
            const decrypted = CryptoService.decrypt(
                "4e3a7447881104244faedd7880cdb788.6ce826b3e97deba90ce227df04f11801",
                "aes-256-cbc",
                key
            );
            expect(decrypted).toEqual("secret");
        });

        it("should throw error when calling with invalid algorithm", () => {
            const key = scryptSync("abc", "def", 32);
            expect(() =>
                CryptoService.decrypt(
                    "4e3a7447881104244faedd7880cdb788.6ce826b3e97deba90ce227df04f11801",
                    "invalid algorithm",
                    key
                )
            ).toThrow();
        });

        it("should throw error when calling with invalid key", () => {
            const key = Buffer.from("invalid-key");
            expect(() =>
                CryptoService.decrypt(
                    "4e3a7447881104244faedd7880cdb788.6ce826b3e97deba90ce227df04f11801",
                    "aes-256-cbc",
                    key
                )
            ).toThrow();
        });
 
        it("should throw error when calling with invalid encrypted data", () => {
            const key = scryptSync("abc", "def", 32);
            expect(() =>
                CryptoService.decrypt(
                    "4e3a7447881104244faedd7880cdb788",
                    "aes-256-cbc",
                    key
                )
            ).toThrow();
        });
    });
});
