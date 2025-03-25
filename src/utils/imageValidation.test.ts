import { ImageValidationError } from "@/consts/image";
import { validateImageDimensions } from "./imageValidation";

describe("validateImageDimensions", () => {
    let originalImage: typeof Image;
    let originalFileReader: typeof FileReader;

    let mockWidth = 0;
    let mockHeight = 0;

    beforeEach(() => {
        originalImage = global.Image;
        originalFileReader = global.FileReader;

        // @ts-expect-error for mocking constructor
        global.FileReader = function createMockFileReader() {
            return {
                readAsDataURL: jest.fn(function mockReadAsDataURL() {
                    if (typeof this.onload === "function") {
                        this.onload({
                            target: { result: "data:image/png;base64,fake" },
                        } as ProgressEvent<FileReader>);
                    }
                }),
                onload: null,
            } as unknown as FileReader;
        };

        // @ts-expect-error for mocking constructor
        global.Image = function createMockImage(): HTMLImageElement {
            const mock = {
                width: 0,
                height: 0,
                onload: null as
                    | ((this: GlobalEventHandlers, ev: Event) => void)
                    | null,
                onerror: null as
                    | ((this: GlobalEventHandlers, ev: Event) => void)
                    | null,
                onabort: null as
                    | ((this: GlobalEventHandlers, ev: UIEvent) => void)
                    | null,
                set src(_val: string) {
                    setTimeout(function triggerImageLoad() {
                        mock.width = mockWidth;
                        mock.height = mockHeight;
                        if (typeof mock.onload === "function") {
                            mock.onload.call(
                                mock as unknown as GlobalEventHandlers,
                                new Event("load")
                            );
                        }
                    }, 0);
                },
            };

            return mock as unknown as HTMLImageElement;
        };
    });

    afterEach(() => {
        global.Image = originalImage;
        global.FileReader = originalFileReader;
        jest.clearAllMocks();
    });

    it("returns true for valid image dimensions and ratio", async () => {
        mockWidth = 800;
        mockHeight = 400;
        const file = new File(["dummy"], "test.jpg", { type: "image/jpeg" });

        const result = await validateImageDimensions(file);
        expect(result).toBe(true);
    });

    it("returns ImageValidationError.SIZE for small image", async () => {
        mockWidth = 500;
        mockHeight = 200;
        const file = new File(["dummy"], "test.jpg", { type: "image/jpeg" });

        await expect(validateImageDimensions(file)).rejects.toBe(
            ImageValidationError.SIZE
        );
    });

    it("returns ImageValidationError.RATIO for invalid ratio", async () => {
        mockWidth = 1000;
        mockHeight = 300;
        const file = new File(["dummy"], "test.jpg", { type: "image/jpeg" });

        await expect(validateImageDimensions(file)).rejects.toBe(
            ImageValidationError.RATIO
        );
    });
});
