import { buildYup } from "schema-to-yup";
import { Metadata } from "@/interfaces/Dataset";
import {
    FormHydration,
    FormHydrationValidation,
} from "@/interfaces/FormHydration";
import {
    formGenerateLegendItems,
    formGetFieldsCompletedCount,
    generateValidationRules,
    mapFormFieldsForSubmission,
} from "./formHydration";

const buildYupSchema = (validationFields: FormHydrationValidation[]) =>
    buildYup({
        title: "Metadata form",
        type: "object",
        properties: generateValidationRules(validationFields),
    });

const schemaFields = [
    {
        title: "Title",
        is_array_form: false,
        description: "",
        location: "summary.title",
        guidance: "",
        field: {
            component: "TextField",
            name: "Title",
            placeholder:
                "North West London COVID-19 Patient Level Situation Report",
            label: "Title of the dataset limited to 150 characters. It should provide a short description of the dataset and be unique across the gateway. If your title is not unique, please add a prefix with your organisation name or identifier to differentiate it from other datasets within the Gateway. Please avoid acronyms wherever possible. Good titles should summarise the content of the dataset and if relevant, the region the dataset covers.",
            limit: 150,
            required: true,
            hidden: false,
        },
    },
    {
        title: "Dataset Abstract",
        is_array_form: false,
        description: "",
        location: "summary.abstract",
        guidance: "",
        field: {
            component: "TextArea",
            name: "Dataset Abstract",
            placeholder:
                "CPRD Aurum contains primary care data contributed by General Practitioner (GP) practices using EMIS Web® including patient registration information and all care events that GPs have chosen to record as part of their usual medical practice.",
            label: "Provide a clear and brief descriptive signpost for researchers who are searching for data that may be relevant to their research. The abstract should allow the reader to determine the scope of the data collection and accurately summarise its content. The optimal length is one paragraph (limited to 255 characters) and effective abstracts should avoid long sentences and abbreviations where possible",
            limit: 500,
            required: true,
            hidden: false,
        },
    },
    {
        title: "Title Optional",
        is_array_form: false,
        description: "",
        location: "summary.title",
        guidance: "",
        field: {
            component: "TextField",
            name: "Title",
            placeholder:
                "North West London COVID-19 Patient Level Situation Report",
            label: "Title of the dataset limited to 150 characters. It should provide a short description of the dataset and be unique across the gateway. If your title is not unique, please add a prefix with your organisation name or identifier to differentiate it from other datasets within the Gateway. Please avoid acronyms wherever possible. Good titles should summarise the content of the dataset and if relevant, the region the dataset covers.",
            limit: 150,
            required: false,
            hidden: false,
        },
    },
];

describe("formGetFieldsCompletedCount", () => {
    it("Should calculate required fields correctly when all empty", () => {
        const getValues = jest.fn(() => [undefined, undefined]);

        expect(
            formGetFieldsCompletedCount(schemaFields, getValues, false)
        ).toBe(0);
    });

    it("Should calculate required fields correctly when all complete", () => {
        const getValues = jest.fn(() => ["test", "test"]);
        expect(
            formGetFieldsCompletedCount(schemaFields, getValues, false)
        ).toBe(100);
    });

    it("Should calculate optional fields correctly when all empty", () => {
        const getValues = jest.fn(() => [undefined]);
        expect(formGetFieldsCompletedCount(schemaFields, getValues, true)).toBe(
            0
        );
    });

    it("Should calculate optional fields correctly when all complete", () => {
        const getValues = jest.fn(() => ["test"]);
        expect(formGetFieldsCompletedCount(schemaFields, getValues, true)).toBe(
            100
        );
    });
});

describe("generateValidationRules", () => {
    // Shape confirmed against the real HDRUK 4.0.0 form_hydration response for
    // "Tools" (an optional list of URL strings) - see GAT-9237.
    const toolsValidation: FormHydrationValidation[] = [
        {
            title: "Tools",
            type: "array",
            required: false,
            of: {
                title: "Tools",
                type: "string",
                required: false,
                format: "url",
            },
        },
    ];

    it("rejects a non-URL value in an optional url-format array field", () => {
        const schema = buildYupSchema(toolsValidation);

        expect(() => schema.validateSync({ Tools: ["das"] })).toThrow(
            /must be a valid URL/
        );
    });

    it("accepts a valid URL in an optional url-format array field", () => {
        const schema = buildYupSchema(toolsValidation);

        expect(() =>
            schema.validateSync({ Tools: ["https://example.com"] })
        ).not.toThrow();
    });

    it("accepts an empty array for an optional url-format array field", () => {
        const schema = buildYupSchema(toolsValidation);

        expect(() => schema.validateSync({ Tools: [] })).not.toThrow();
    });

    it("still enforces at least one value for a required array field", () => {
        const requiredEnumValidation: FormHydrationValidation[] = [
            {
                title: "Category",
                type: "array",
                required: true,
                of: {
                    title: "Category",
                    type: "string",
                    required: true,
                    enum: ["A", "B"],
                },
            },
        ];
        const schema = buildYupSchema(requiredEnumValidation);

        expect(() => schema.validateSync({ Category: [] })).toThrow();
        expect(() => schema.validateSync({ Category: ["A"] })).not.toThrow();
    });
});

describe("mapFormFieldsForSubmission", () => {
    // A minimal schema for a single field that lives outside the provenance
    // section, so a "partial draft" produces formattedFormData with no
    // provenance branch at all - the exact condition that used to throw.
    const schema = [
        {
            title: "Title",
            is_array_form: false,
            location: "summary.title",
            field: {
                component: "TextField",
                name: "Title",
                required: true,
                hidden: false,
            },
        },
    ] as unknown as FormHydration[];

    const submit = (formData: Record<string, unknown>) =>
        mapFormFieldsForSubmission(formData as unknown as Metadata, schema) as {
            provenance?: { origin?: { datasetType?: unknown } };
        };

    it("does not throw when the provenance section is empty (partial draft)", () => {
        expect(() => submit({ Title: "A partial draft" })).not.toThrow();
    });

    it("defaults datasetType to an empty array when Dataset Type Array is absent", () => {
        const result = submit({ Title: "A partial draft" });

        expect(result.provenance?.origin?.datasetType).toEqual([]);
    });

    it("maps Dataset Type Array into provenance.origin.datasetType when provenance is otherwise empty", () => {
        const result = submit({
            "Dataset Type Array": [
                {
                    "Dataset type": "Health and disease",
                    "Dataset subtypes": ["Cancer"],
                },
            ],
        });

        expect(result.provenance?.origin?.datasetType).toEqual([
            { name: "Health and disease", subTypes: ["Cancer"] },
        ]);
    });

    it("defaults subTypes to an empty array when Dataset subtypes is missing", () => {
        const result = submit({
            "Dataset Type Array": [{ "Dataset type": "Health and disease" }],
        });

        expect(result.provenance?.origin?.datasetType).toEqual([
            { name: "Health and disease", subTypes: [] },
        ]);
    });
});

describe("formGenerateLegendItems", () => {
    const section = "enrichmentAndLinkage";
    const sectionFields = [
        {
            title: "Tools",
            is_array_form: false,
            description: "",
            location: "enrichmentAndLinkage.tools",
            guidance: "",
            field: {
                component: "Autocomplete",
                name: "Tools",
                required: false,
                hidden: false,
            },
        },
    ];

    // activeSectionName === section short-circuits formGetSectionStatus to
    // ACTIVE, so this test only exercises the clearErrors behaviour we care about.
    const runLegend = async (dirtyFields: Record<string, boolean>) => {
        const clearErrors = jest.fn();
        const trigger = jest.fn(() => Promise.resolve(false));
        const getValues = jest.fn();

        await formGenerateLegendItems(
            [section],
            section,
            true,
            sectionFields,
            clearErrors,
            getValues,
            trigger,
            false,
            dirtyFields
        );

        return clearErrors;
    };

    it("does not clear the error for a field the user has already touched", async () => {
        const clearErrors = await runLegend({ Tools: true });

        expect(clearErrors).not.toHaveBeenCalled();
    });

    it("clears the probe-validation error for a field the user hasn't touched", async () => {
        const clearErrors = await runLegend({});

        expect(clearErrors).toHaveBeenCalledWith(["Tools"]);
    });
});
