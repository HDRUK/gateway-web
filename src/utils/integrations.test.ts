import { AuthType } from "@/interfaces/Integration";
import { authTypes } from "@/consts/integrations";
import { requiresSecretKey } from "./integrations";

describe("Integrations utils", () => {
    describe("requiresSecretKey", () => {
        it("should return true if API_KEY", () => {
            expect(requiresSecretKey(authTypes.API_KEY as AuthType)).toBe(true);
        });
        it("should return true if BEARER", () => {
            expect(requiresSecretKey(authTypes.BEARER as AuthType)).toBe(true);
        });
        it("should return true if NO_AUTH", () => {
            expect(requiresSecretKey(authTypes.NO_AUTH as AuthType)).toBe(
                false
            );
        });
    });
});
