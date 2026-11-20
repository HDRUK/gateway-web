import { OnboardingForm } from "@/interfaces/OnboardingForm";
import { hydrateFormValues } from "./hydrateFormValues";

const form = (overrides: Partial<OnboardingForm> = {}) =>
    ({
        model: "HDRUK",
        version: "4.1.0",
        schemas: [],
        default: { model: "HDRUK", version: "4.1.0" },
        schema: {},
        defaultValues: {},
        ...overrides,
    } as OnboardingForm);

describe("hydrateFormValues", () => {
    it("layers the saved metadata over the team's defaults", () => {
        const values = hydrateFormValues(
            form({
                defaultValues: {
                    summary: { contactPoint: "team@example.com", title: "" },
                },
                metadata: { summary: { title: "Saved title" } },
            })
        );

        expect(values).toEqual({
            summary: { contactPoint: "team@example.com", title: "Saved title" },
        });
    });

    it("replaces default lists with saved ones rather than merging them", () => {
        const values = hydrateFormValues(
            form({
                defaultValues: { coverage: { materialType: ["None"] } },
                metadata: { coverage: { materialType: ["Blood"] } },
            })
        );

        expect(values).toEqual({ coverage: { materialType: ["Blood"] } });
    });

    it("encodes the custodian logo URL, without changing the form passed in", () => {
        const input = form({
            defaultValues: {
                summary: {
                    dataCustodian: { logo: "https://example.com/my logo.png" },
                },
            },
        });

        const values = hydrateFormValues(input);

        expect(values).toEqual({
            summary: {
                dataCustodian: { logo: "https://example.com/my%20logo.png" },
            },
        });
        expect(input.defaultValues).toEqual({
            summary: {
                dataCustodian: { logo: "https://example.com/my logo.png" },
            },
        });
    });

    it("drops the given paths from the saved metadata, e.g. when duplicating", () => {
        const values = hydrateFormValues(
            form({
                metadata: { identifier: "abc", summary: { title: "Copy me" } },
            }),
            ["identifier"]
        );

        expect(values).toEqual({ summary: { title: "Copy me" } });
    });

    it("returns the defaults for a dataset with no saved metadata", () => {
        expect(
            hydrateFormValues(form({ defaultValues: { version: "1.0.0" } }))
        ).toEqual({ version: "1.0.0" });
    });
});
