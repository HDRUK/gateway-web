/* eslint-disable no-underscore-dangle */
import { generateUserV1 } from "@/mocks/data";
import { getUserFromToken } from "@/utils/general";

const generatedUser = generateUserV1();

jest.mock("jwt-decode", () => () => ({ user: generatedUser }));

describe("general", () => {
    describe("getUserFromToken", () => {
        it("should return undefined if no token present", () => {
            const user = getUserFromToken({});
            expect(user).toBeUndefined();
        });
        it("should return user", () => {
            const user = getUserFromToken({ token: "encryptedTokenValue" });
            expect(user).toEqual(generatedUser);
        });
    });
});
