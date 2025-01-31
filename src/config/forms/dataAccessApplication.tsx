import * as yup from "yup";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import { inputComponents } from ".";

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

const formFields = [
    {
        label: "Project title",
        name: "project_title",
        component: inputComponents.TextField,
        required: true,
    },
];

const LAST_SAVED_DATE_FORMAT = "DD MMM YYYY HH:mm";

const excludedQuestionFields = formFields.map(field => field.name);

export {
    validationSchema as darApplicationValidationSchema,
    formFields as darApplicationFormFields,
    beforeYouBeginSection,
    excludedQuestionFields,
    LAST_SAVED_DATE_FORMAT,
};
