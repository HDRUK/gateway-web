import { REGEX_ALPHA_NUMERIC_ONLY, REGEX_NUMERIC_ONLY } from "@/consts/regex";
import * as yup from "yup";
import { inputComponents } from ".";

const defaultValues = {
    name: "",
    image_link: "",
    tags: [],
    description: "",
    enabled: false,
};

const validationSchema = yup
    .object({
        name: yup
            .string()
            .matches(
                REGEX_ALPHA_NUMERIC_ONLY,
                "Public API should have alphanumeric characters only"
            )
            .required()
            .label("Public API name"),
        tags: yup
            .array()
            .of(
                yup
                    .string()
                    .matches(
                        REGEX_NUMERIC_ONLY,
                        "Tag(s) should have numeric characters only"
                    )
                    .required()
            )
            .strict()
            .required(),
        description: yup.string().required().label("Description"),
    })
    .required();

const formFields = [
    {
        label: "Public API name",
        name: "name",
        component: inputComponents.TextField,
        required: true,
    },
    // todo: Implement once Tags have been discussed
    // {
    //     label: "Tag(s)",
    //     name: "tags",
    //     createLabel: "Add tag",
    //     selectOnFocus: true,
    //     clearOnBlur: true,
    //     handleHomeEndKeys: true,
    //     freeSolo: true,
    //     multiple: true,
    //     canCreate: true,
    //     options: [],
    //     getOptionLabel: (
    //         option: string | { label: string; value: unknown }
    //     ) => {
    //         if (typeof option === "string") return option;
    //         return option?.label;
    //     },
    //     component: inputComponents.Autocomplete,
    // },
    {
        label: "Description",
        name: "description",
        component: inputComponents.TextArea,
        limit: 300,
        required: true,
    },
];

export {
    defaultValues as applicationDefaultValues,
    validationSchema as applicationValidationSchema,
    formFields as applicationFormFields,
};
