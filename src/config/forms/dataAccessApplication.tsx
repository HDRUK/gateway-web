import { buildYup } from "schema-to-yup";
import * as yup from "yup";
import { ComponentTypes } from "@/interfaces/ComponentTypes";
import { DarApplicationQuestion } from "@/interfaces/DataAccessRequest";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import { inputComponents } from ".";

const LAST_SAVED_DATE_FORMAT = "DD MMM YYYY HH:mm";

const beforeYouBeginSection: QuestionBankSection = {
    id: 0,
    created_at: "",
    updated_at: "",
    deleted_at: null,
    name: "Before you begin",
    description:
        "Preparation is key to a successful data access request. You need to be able to demonstrate how you will ensure safe use of patient data and the potential for public benefit. The steps below are intended to help you get off to a good start.",
    order: 0,
    parent_section: null,
};

const validationSchema = yup.object({
    project_title: yup.string().required().label("Project title"),
});

const beforeYouBeginFormFields = [
    {
        label: "Project title",
        name: "project_title",
        component: inputComponents.TextField,
        required: true,
    },
];

const excludedQuestionFields = beforeYouBeginFormFields.map(
    field => field.name
);

const getFieldType = (componentType: ComponentTypes): string => {
    switch (componentType) {
        case "CheckboxGroup":
        case "CheckboxRow":
        case "Switch":
        case "SwitchInline":
            return "boolean";
        case "DatePicker":
            return "date";
        case "FileUpload":
        case "FileUploadMultiple":
            return "object";
        default:
            return "string";
    }
};

const generateYupSchema = (fields: DarApplicationQuestion[]) => {
    const schemaConfig: Record<number | string, unknown> = {};

    const processField = (field: DarApplicationQuestion) => {
        const fieldSchema: {
            type: string;
            label: string;
            required: boolean;
            errors: Record<string, string>;
            properties?: Record<string, unknown>;
        } = {
            type: getFieldType(field.component),
            label: field.title,
            required: !!field.required,
            errors: {},
            ...field.validations,
            properties:
                field.component === inputComponents.FileUpload
                    ? {
                          value: {
                              type: "object",
                              properties: {
                                  filename: {
                                      type: "string",
                                      required: !!field.required,
                                  },
                              },
                              required: !!field.required,
                          },
                      }
                    : field.component === inputComponents.FileUploadMultiple
                    ? {
                          value: {
                              type: "array",
                              required: !!field.required,
                          },
                      }
                    : undefined,
        };

        schemaConfig[field.question_id] = fieldSchema;

        // Process children recursively
        if (field.options?.length) {
            field.options.forEach(option => {
                if (option.children) {
                    Object.values(option.children).flat().forEach(processField);
                }
            });
        }
    };
    fields.forEach(processField);
    return buildYup({ type: "object", properties: schemaConfig });
};

const messageSection: QuestionBankSection = {
    id: 99,
    name: "Messages",
    created_at: "",
    updated_at: "",
    deleted_at: null,
    description: null,
    parent_section: null,
    order: 9,
};

export {
    validationSchema as darApplicationValidationSchema,
    beforeYouBeginFormFields,
    beforeYouBeginSection,
    excludedQuestionFields,
    LAST_SAVED_DATE_FORMAT,
    generateYupSchema,
    messageSection,
};
