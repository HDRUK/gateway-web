import {
    capitalise,
    splitCamelcase,
    getTrimmedpathname,
    extractSubdomain,
    convertToCamelCase,
    parseStaticImagePaths,
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

    it("should convert path string to camelcase", async () => {
        expect(convertToCamelCase("text_string")).toBe("textString");
    });

    it("should return reformatted static image paths", async () => {
        const mockedData = {
            datasets: "welcome-image.png",
        };

        expect(parseStaticImagePaths(mockedData, "landing_page")).toEqual({
            datasets: "https://media.url/landing_page/welcome-image.png",
        });
    });
});
