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
        expect(extractSubdomain("https://api.foo.bar.baz.uk/api/v1")).toEqual(
            ".foo.bar.baz.uk"
        );
    });
});
