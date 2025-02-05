import {
    DarApplicationQuestion,
    DarFormattedField,
} from "@/interfaces/DataAccessRequest";
import { inputComponents } from "@/config/forms";

const mapKeysToValues = (keys: string[], valuesArray: (string | undefined)[]) =>
    Object.fromEntries(keys.map((key, index) => [key, valuesArray[index]]));

const calculateQuestionCount = (
    filteredData: DarFormattedField[],
    parentValues: {
        [k: string]: string | undefined;
    }
) =>
    filteredData.reduce((count, field) => {
        let questionCount = 1;

        // Check if the question has children that should be displayed
        if (field.options?.length) {
            const selectedOption = parentValues[field.question_id];

            const visibleChildren = field.options.flatMap(option =>
                selectedOption === option.label ? option.children || [] : []
            );

            questionCount += visibleChildren.length;
        }

        return count + questionCount;
    }, 0);

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

export { calculateQuestionCount, mapKeysToValues, formatDarQuestion };
