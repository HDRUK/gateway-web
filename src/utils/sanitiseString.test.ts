import { sanitiseString } from "@/utils/sanitiseString";

describe("sanitiseString", () => {
    it("replaces spaces with hyphens", () => {
        expect(sanitiseString("image filename.jpg")).toBe("image-filename.jpg");
    });

    it("removes special characters", () => {
        expect(sanitiseString("image@file#name!.png")).toBe(
            "imagefilename.png"
        );
    });

    it("collapses multiple spaces", () => {
        expect(sanitiseString("image    file    name.jpg")).toBe(
            "image-file-name.jpg"
        );
    });

    it("keeps dots, hyphens, and underscores", () => {
        expect(sanitiseString("image-file_name.version2.jpg")).toBe(
            "image-file_name.version2.jpg"
        );
    });

    it("handles leading/trailing spaces and special characters", () => {
        expect(sanitiseString("  ***Image FileName!***  ")).toBe(
            "-Image-FileName-"
        );
    });

    it("returns empty string if input is empty", () => {
        expect(sanitiseString("")).toBe("");
    });

    it("returns same string if already clean", () => {
        expect(sanitiseString("image-file_name.png")).toBe(
            "image-file_name.png"
        );
    });
});
