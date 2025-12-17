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

const fileBasedTemplateSection: QuestionBankSection = {
    id: 1,
    created_at: "",
    updated_at: "",
    deleted_at: null,
    name: "File-based Data Access Request Template",
    description: "",
    order: 1,
    parent_section: 1,
};

const validationSchema = yup.object({
    project_title: yup.string().required().label("Application title"),
});

const beforeYouBeginFormFields = [
    {
        label: "Application title",
        name: "project_title",
        title: "project_title",
        guidance:
            "This can be your project name or anything that helps the custodian identify your application.",
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
        case "SwitchInline":
            return "boolean";
        case "DatePicker":
            return "date";
        case "FileUpload":
        case "FileUploadMultiple":
        case "DocumentExchange":
            return "object";
        default:
            return "string";
    }
};

const buildFieldType = (field: DarApplicationQuestion) => ({
    type: getFieldType(field.component),
    label: field.title,
    required: !!field.required,
    errors: {},
    ...field.validations,
    properties:
        field.component === inputComponents.FileUpload ||
        field.component === inputComponents.DocumentExchange
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
});

const buildProperties = (fields: DarApplicationQuestion[]) => {
    const props: Record<number | string, unknown> = {};

    const processField = (field: DarApplicationQuestion) => {
        if (field.component === "ArrayField" && field.fields?.length) {
            const arrayKey = field.title;

            props[arrayKey] = {
                type: "array",
                label: field.title ?? arrayKey,
                required: !!field.required,
                items: {
                    type: "object",
                    properties: buildProperties(field.fields),
                },
            };
            return;
        }

        // normal field
        props[field.question_id] = buildFieldType(field);

        // Process children recursively
        field.options?.forEach(o => o.children?.forEach(c => processField(c)));
    };

    fields.forEach(processField);
    return props;
};

const generateYupSchema = (fields: DarApplicationQuestion[]) =>
    buildYup({ type: "object", properties: buildProperties(fields) });

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
    fileBasedTemplateSection,
    excludedQuestionFields,
    LAST_SAVED_DATE_FORMAT,
    generateYupSchema,
    messageSection,
};
