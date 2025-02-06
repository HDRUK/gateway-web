import {
    DarApplicationQuestion,
    DarFormattedField,
} from "@/interfaces/DataAccessRequest";
import { inputComponents } from "@/config/forms";

const mapKeysToValues = (keys: string[], valuesArray: (string | undefined)[]) =>
    Object.fromEntries(keys.map((key, index) => [key, valuesArray[index]]));

const getVisibleQuestionIds = (
    filteredData: DarFormattedField[],
    parentValues: { [k: string]: string | undefined },
    staticFieldsNames: string[]
): string[] => [
    ...filteredData.flatMap(field => [
        field.question_id.toString(),
        ...(field.options
            ?.find(opt => opt.label === parentValues[field.question_id])
            ?.children.map(child => child.question_id.toString()) || []),
    ]),
    ...staticFieldsNames,
];

const formatDarQuestion = (
    field: DarApplicationQuestion
): DarFormattedField => ({
    name: field.title,
    component: field.component,
    required: field.required,
    question_id: field.question_id,
    section_id: field.section_id,
    options:
        field.options?.map(option => ({
            label: option.label,
            value: option.label,
            children:
                (option.children &&
                    Object.values(option.children)
                        .flat()
                        .map(formatDarQuestion)) ||
                [],
        })) || [],
    ...(field.component === inputComponents.RadioGroup && {
        radios: field.options?.map(option => ({
            label: option.label,
            value: option.label,
        })),
    }),
    ...(field.component === inputComponents.CheckboxGroup && {
        checkboxes: field.options?.map(option => ({
            label: option.label,
            value: option.label,
        })),
    }),
});

export { getVisibleQuestionIds, mapKeysToValues, formatDarQuestion };
