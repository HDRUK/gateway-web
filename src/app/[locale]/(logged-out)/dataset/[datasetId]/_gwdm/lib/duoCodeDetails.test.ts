import { V4Schema } from "@/interfaces/V4Schema";
import { toDuoCodeDetails } from "./duoCodeDetails";

const schema = {
    name: "HDRUK",
    version: "4.1.0",
    schema: {
        $defs: {
            DuoCodesEnum: {
                oneOf: [
                    {
                        const: "DUO:0000042",
                        shortcode: "GRU",
                        title: "General research use",
                        description: "Use allowed for general research.",
                    },
                ],
            },
        },
    },
} as unknown as V4Schema;

describe("toDuoCodeDetails", () => {
    it("maps each DUO code to its shortcode, label and description", () => {
        expect(toDuoCodeDetails(schema)).toEqual({
            "DUO:0000042": {
                shortcode: "GRU",
                label: "General research use",
                description: "Use allowed for general research.",
            },
        });
    });

    it("is empty when the schema or its DUO enum is missing", () => {
        expect(toDuoCodeDetails(undefined)).toEqual({});
        expect(
            toDuoCodeDetails({ schema: { $defs: {} } } as unknown as V4Schema)
        ).toEqual({});
    });
});
