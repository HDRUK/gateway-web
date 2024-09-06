/* eslint-disable no-underscore-dangle */
import jwtDecode from "jwt-decode";
import { getUserFromToken } from "@/utils/cookies";
import { generateUserV1 } from "@/mocks/data";

const generatedUser = generateUserV1();

jest.mock("jwt-decode", () => jest.fn());

describe("Cookies utils", () => {
    describe("getUserFromToken", () => {
        it("should return null if no token present", () => {
            const user = getUserFromToken(undefined);
            expect(user).toBeNull();
        });
        it("should return null if token expired", () => {
            (jwtDecode as jest.Mock).mockReturnValue({
                user: generatedUser,
                exp: Math.floor(Date.now() / 1000) - 3600,
            });

            const user = getUserFromToken("encryptedTokenValue");
            expect(user).toBeNull();
        });
        it("should return user", () => {
            (jwtDecode as jest.Mock).mockReturnValue({
                user: generatedUser,
                exp: Math.floor(Date.now() / 1000) + 3600,
            });

            const user = getUserFromToken("encryptedTokenValue");
            expect(user).toEqual(generatedUser);
        });
    });
});
