import {
    capitalise,
    splitCamelcase,
    getTrimmedpathname,
    extractSubdomain,
} from "./general";

describe("General utils", () => {
    it("should return capitalised string", async () => {
        expect(capitalise("string")).toEqual("String");
    });
    it("should return string with spaces", async () => {
        expect(splitCamelcase("stringToBeSplit")).toEqual("string To Be Split");
    });
    it("should return string without locale", async () => {
        expect(getTrimmedpathname("en", "/en/the/route")).toEqual("/the/route");
    });
    it("should return url without subdomain", async () => {
        expect(
            extractSubdomain("https://api.dev.hdruk.cloud.uk/api/va")
        ).toEqual(".dev.hdruk.cloud.uk");
    });
});
