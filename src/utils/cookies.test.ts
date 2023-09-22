/* eslint-disable no-underscore-dangle */
import { generateUserV1 } from "@/mocks/data";
import { getUserFromToken } from "@/utils/cookies";

const generatedUser = generateUserV1();

jest.mock("jwt-decode", () => () => ({ user: generatedUser }));

describe("Cookies utils", () => {
    describe("getUserFromToken", () => {
        it("should return null if no token present", () => {
            const user = getUserFromToken(undefined);
            expect(user).toBeNull();
        });
        it("should return user", () => {
            const user = getUserFromToken("encryptedTokenValue");
            expect(user).toEqual(generatedUser);
        });
    });
});
