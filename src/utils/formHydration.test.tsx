import { formGetFieldsCompletedCount } from "./formHydration";

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
