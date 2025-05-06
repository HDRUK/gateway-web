/* eslint-disable no-underscore-dangle */
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { getUserFromToken, setTemporaryCookie } from "@/utils/cookies";
import { generateUserV1 } from "@/mocks/data";

const generatedUser = generateUserV1();

jest.mock("jwt-decode", () => jest.fn());

jest.mock("js-cookie", () => {
    return {
        __esModule: true,
        default: {
            set: jest.fn(),
        },
    };
});

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

    describe("setTemporaryCookie", () => {
        it("should set a cookie with calculated expiry in days", () => {
            const name = "test-cookie";
            const value = "123";
            const seconds = 60;

            setTemporaryCookie(name, value, seconds);

            const expectedExpiryInDays = seconds / (24 * 60 * 60);
            expect(Cookies.set).toHaveBeenCalledWith(name, value, {
                expires: expectedExpiryInDays,
            });
        });
    });
});
