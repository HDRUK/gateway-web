import * as yup from "yup";
import { inputComponents } from ".";

const cohortAcceptTermsDefaultValues = {
    hasAccepted: false,
};

const cohortAcceptTermsValidationSchema = yup
    .object({
        hasAccepted: yup.boolean().required().oneOf([true], ""),
    })
    .required();

const cohortAcceptTermsField = {
    component: inputComponents.Checkbox,
    formControlSx: { mb: 0 },
    name: "hasAccepted",
    required: true,
};

export {
    cohortAcceptTermsField,
    cohortAcceptTermsDefaultValues,
    cohortAcceptTermsValidationSchema,
};
