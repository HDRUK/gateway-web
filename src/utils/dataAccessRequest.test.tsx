import {
    DarApplicationQuestion,
    DarFormattedField,
} from "@/interfaces/DataAccessRequest";
import { inputComponents } from "@/config/forms";
import { ARRAY_FIELD } from "@/consts/dataAccess";
import {
    formatDarAnswers,
    formatDarQuestion,
    getVisibleQuestionIds,
    mapKeysToValues,
} from "./dataAccessRequest";

const ARRAY_NAME = "Other individuals - array";

type QA = { question_id: string; answer: any };
type Q = {
    component?: string;
    title?: string;
    name?: string;
    fields?: { question_id: number; is_child?: number }[];
};

describe("Data Access Request utils", () => {
    describe("mapKeysToValues", () => {
        it("creates an object from two arrays correctly", () => {
            const keys = ["key1", "key2"];
            const values = ["value1", "value2"];

            expect(mapKeysToValues(keys, values)).toEqual({
                key1: "value1",
                key2: "value2",
            });
        });

        it("returns an empty object for empty input arrays", () => {
            expect(mapKeysToValues([], [])).toEqual({});
        });

        it("ignores extra values if key array is longer", () => {
            const keys = ["key1", "key2"];
            const values = ["value1"];

            expect(mapKeysToValues(keys, values)).toEqual({
                key1: "value1",
                key2: undefined,
            });
        });
    });

    describe("getVisibleQuestionIds", () => {
        it("returns the question ids when no children exist", () => {
            const filteredData: DarFormattedField[] = [
                {
                    question_id: 1,
                    options: [],
                } as Partial<DarFormattedField> as DarFormattedField,
                {
                    question_id: 2,
                    options: [],
                } as Partial<DarFormattedField> as DarFormattedField,
            ];

            const parentValues = {};
            const staticFieldsNames: string[] = [];

            expect(
                getVisibleQuestionIds(
                    filteredData,
                    parentValues,
                    staticFieldsNames
                )
            ).toEqual(["1", "2"]);
        });

        it("does not include children if parent value does not match", () => {
            const filteredData: DarFormattedField[] = [
                {
                    question_id: 1,
                    options: [
                        {
                            label: "Option A",
                            value: "Option A",
                            children: [{ question_id: 2 }],
                        },
                    ],
                } as Partial<DarFormattedField> as DarFormattedField,
            ];

            const parentValues = { "1": "Option B" };
            const staticFieldsNames: string[] = [];

            expect(
                getVisibleQuestionIds(
                    filteredData,
                    parentValues,
                    staticFieldsNames
                )
            ).toEqual(["1"]);
        });

        it("includes children if parent value matches", () => {
            const filteredData: DarFormattedField[] = [
                {
                    question_id: 1,
                    options: [
                        {
                            label: "Option A",
                            value: "Option A",
                            children: [{ question_id: 2 }],
                        },
                    ],
                } as Partial<DarFormattedField> as DarFormattedField,
            ];

            const parentValues = { "1": "Option A" };
            const staticFieldsNames: string[] = [];

            expect(
                getVisibleQuestionIds(
                    filteredData,
                    parentValues,
                    staticFieldsNames
                )
            ).toEqual(["1", "2"]);
        });

        it("includes inner fields of an ArrayField and any children selected in any row", () => {
            const filteredData: DarFormattedField[] = [
                {
                    component: ARRAY_FIELD,
                    name: ARRAY_NAME,
                    fields: [
                        {
                            question_id: 1752,
                            options: [
                                { label: "No", value: "No", children: [] },
                            ],
                        } as Partial<DarFormattedField>,
                        {
                            question_id: 1762,
                            options: [
                                {
                                    label: "Yes",
                                    children: [
                                        {
                                            question_id: 1763,
                                        } as DarFormattedField,
                                    ],
                                },
                                { label: "No", children: [] },
                            ],
                        } as Partial<DarFormattedField>,
                    ],
                } as unknown as DarFormattedField,
            ];

            const parentValues = {
                [ARRAY_NAME]: [
                    { "1752": "Alice", "1762": "Yes" },
                    { "1752": "Bob", "1762": "No" },
                ],
            };
            const staticFieldsNames: string[] = [];

            const rows = parentValues[ARRAY_NAME] as Array<
                Record<string, string>
            >;

            const expected = rows.flatMap((row, i) => [
                `${ARRAY_NAME}.${i}.1752`,
                `${ARRAY_NAME}.${i}.1762`,
                ...(row["1762"] === "Yes" ? [`${ARRAY_NAME}.${i}.1763`] : []),
            ]);

            const actual = getVisibleQuestionIds(
                filteredData,
                parentValues,
                staticFieldsNames
            );

            expect(actual.sort()).toEqual(expected.sort());
        });

        it("includes inner fields of an ArrayField even if rows have undefined values, but does not include children when not selected", () => {
            const filteredData: DarFormattedField[] = [
                {
                    component: ARRAY_FIELD,
                    name: ARRAY_NAME,
                    fields: [
                        {
                            question_id: 1752,
                            options: [],
                        } as Partial<DarFormattedField>,
                        {
                            question_id: 1762,
                            options: [
                                {
                                    label: "Yes",
                                    children: [
                                        {
                                            question_id: 1763,
                                        } as DarFormattedField,
                                    ],
                                },
                                { label: "No", children: [] },
                            ],
                        } as DarFormattedField,
                    ],
                } as unknown as DarFormattedField,
            ];

            const parentValues = {
                [ARRAY_NAME]: [
                    { "1752": "Alice" },
                    { "1752": "Bob", "1762": "No" },
                ],
            };
            const staticFieldsNames: string[] = [];

            const rows = parentValues[ARRAY_NAME] as Array<
                Record<string, string>
            >;

            // Expect inner fields per row; no children since "Yes" wasn't selected
            const expected = rows.flatMap((_, i) => [
                `${ARRAY_NAME}.${i}.1752`,
                `${ARRAY_NAME}.${i}.1762`,
            ]);

            expect(
                getVisibleQuestionIds(
                    filteredData,
                    parentValues,
                    staticFieldsNames
                ).sort()
            ).toEqual(expected.sort());
        });

        it("handles empty ArrayField rows - includes inner fields but no children", () => {
            const filteredData: DarFormattedField[] = [
                {
                    component: ARRAY_FIELD,
                    name: ARRAY_NAME,
                    fields: [
                        {
                            question_id: 1752,
                            options: [],
                        } as Partial<DarFormattedField>,
                        {
                            question_id: 1762,
                            options: [
                                {
                                    label: "Yes",
                                    children: [
                                        {
                                            question_id: 1763,
                                        } as DarFormattedField,
                                    ],
                                },
                                { label: "No", children: [] },
                            ],
                        } as DarFormattedField,
                    ],
                } as unknown as DarFormattedField,
            ];

            const parentValues = { [ARRAY_NAME]: [] };
            const staticFieldsNames: string[] = [];

            const rows = parentValues[ARRAY_NAME];

            const expected: string[] = rows.flatMap((_, i) => [
                `${ARRAY_NAME}.${i}.1752`,
                `${ARRAY_NAME}.${i}.1762`,
            ]);

            expect(
                getVisibleQuestionIds(
                    filteredData,
                    parentValues,
                    staticFieldsNames
                ).sort()
            ).toEqual(expected.sort());
        });
    });

    describe("formatDarAnswers", () => {
        it("passes through non-array answers", () => {
            const questions: Q[] = [];
            const userAnswers: QA[] = [
                { question_id: "1722", answer: "Title" },
                { question_id: "1729", answer: "Yes" },
            ];

            expect(formatDarAnswers(userAnswers, questions)).toEqual({
                "1722": "Title",
                "1729": "Yes",
            });
        });

        it("formats columns into rows for a single ArrayField", () => {
            const questions: Q[] = [
                {
                    component: ARRAY_FIELD,
                    title: ARRAY_NAME,
                    fields: [{ question_id: 1752 }, { question_id: 1753 }],
                },
            ];

            // Backend provided “columns”: each child qid can have multiple values
            const userAnswers: QA[] = [
                { question_id: "1752", answer: ["Alice", "Bob"] },
                { question_id: "1753", answer: ["Dev", "PM"] },
            ];

            expect(formatDarAnswers(userAnswers, questions)).toEqual({
                [ARRAY_NAME]: [
                    { "1752": "Alice", "1753": "Dev" },
                    { "1752": "Bob", "1753": "PM" },
                ],
            });
        });

        it("handles uneven column lengths and drops fully empty rows", () => {
            const questions: Q[] = [
                {
                    component: ARRAY_FIELD,
                    title: ARRAY_NAME,
                    fields: [
                        { question_id: 1752 },
                        { question_id: 1753 },
                        { question_id: 1762 },
                    ],
                },
            ];

            const userAnswers: QA[] = [
                { question_id: "1752", answer: ["Alice", "Bob"] },
                { question_id: "1753", answer: ["Dev"] },
                { question_id: "1762", answer: [] },
            ];

            expect(formatDarAnswers(userAnswers, questions)).toEqual({
                [ARRAY_NAME]: [
                    { "1752": "Alice", "1753": "Dev", "1762": "" },
                    { "1752": "Bob", "1753": "", "1762": "" },
                ],
            });
        });

        it("drops rows that are fully empty", () => {
            const questions: Q[] = [
                {
                    component: ARRAY_FIELD,
                    title: ARRAY_NAME,
                    fields: [{ question_id: 1752 }, { question_id: 1753 }],
                },
            ];

            const userAnswers: QA[] = [
                { question_id: "1752", answer: ["Alice", ""] },
                { question_id: "1753", answer: ["Dev", ""] },
            ];

            expect(formatDarAnswers(userAnswers, questions)).toEqual({
                [ARRAY_NAME]: [{ "1752": "Alice", "1753": "Dev" }],
            });
        });

        it("supports multiple ArrayFields at once and keeps non-array answers", () => {
            const ARRAY_NAME_2 = "Declaration of interest - array";

            const questions: Q[] = [
                {
                    component: ARRAY_FIELD,
                    title: ARRAY_NAME,
                    fields: [{ question_id: 1752 }, { question_id: 1753 }],
                },
                {
                    component: ARRAY_FIELD,
                    title: ARRAY_NAME_2,
                    fields: [{ question_id: 1832 }, { question_id: 1839 }],
                },
            ];

            const userAnswers: QA[] = [
                // non array
                { question_id: "1722", answer: "Project X" },

                // first array
                { question_id: "1752", answer: ["Alice", "Bob"] },
                { question_id: "1753", answer: ["Dev", "PM"] },

                // second array
                { question_id: "1832", answer: ["Yes"] },
                { question_id: "1839", answer: ["Describe"] },
            ];

            expect(formatDarAnswers(userAnswers, questions)).toEqual({
                "1722": "Project X",
                [ARRAY_NAME]: [
                    { "1752": "Alice", "1753": "Dev" },
                    { "1752": "Bob", "1753": "PM" },
                ],
                [ARRAY_NAME_2]: [{ "1832": "Yes", "1839": "Describe" }],
            });
        });

        it("wraps single value answers into array", () => {
            const questions: Q[] = [
                {
                    component: ARRAY_FIELD,
                    title: ARRAY_NAME,
                    fields: [{ question_id: 1752 }, { question_id: 1753 }],
                },
            ];

            const userAnswers: QA[] = [
                { question_id: "1752", answer: "Alice" },
                { question_id: "1753", answer: "Dev" },
            ];

            expect(formatDarAnswers(userAnswers, questions)).toEqual({
                [ARRAY_NAME]: [{ "1752": "Alice", "1753": "Dev" }],
            });
        });
    });

    describe("formatDarQuestion", () => {
        it("formats a basic question correctly", () => {
            const input: DarApplicationQuestion = {
                appliciation_id: 1,
                question_id: 101,
                title: "What is your name?",
                component: inputComponents.TextField,
                required: true,
                section_id: 1,
                guidance: "",
                order: 1,
                validations: {},
                is_child: 0,
                options: [],
            };

            const expected: DarFormattedField = {
                name: "What is your name?",
                component: inputComponents.TextField,
                required: true,
                question_id: 101,
                section_id: 1,
                options: [],
            };

            expect(formatDarQuestion(input)).toEqual(expected);
        });

        it("formats a question with radio buttons correctly", () => {
            const input: DarApplicationQuestion = {
                appliciation_id: 1,
                question_id: 105,
                title: "Select one option",
                component: inputComponents.RadioGroup,
                required: true,
                section_id: 5,
                guidance: "",
                order: 6,
                validations: {},
                is_child: 0,
                options: [
                    { label: "Yes", children: {} },
                    { label: "No", children: {} },
                ],
            };

            const expected: DarFormattedField = {
                name: "Select one option",
                component: inputComponents.RadioGroup,
                required: true,
                question_id: 105,
                section_id: 5,
                options: [
                    { label: "Yes", value: "Yes", children: [] },
                    { label: "No", value: "No", children: [] },
                ],
                radios: [
                    { label: "Yes", value: "Yes" },
                    { label: "No", value: "No" },
                ],
            };

            expect(formatDarQuestion(input)).toEqual(expected);
        });
    });
});
