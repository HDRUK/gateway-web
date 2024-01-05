import * as yup from "yup";

const validationSchema = yup
    .object({
        summary: yup.object({
            title: yup.string().required().label("Title"),
        }),
    })
    .required();

export { validationSchema as datasetValidationSchema };
