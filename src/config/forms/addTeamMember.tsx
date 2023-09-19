import * as yup from "yup";
import { SearchRoundedIcon } from "@/consts/icons";
import { inputComponents } from ".";

const defaultValues = {
    name: "",
};

const validationSchema = yup
    .object({
        name: yup.string().required().label("User"),
    })
    .required();

const formFields = [
    {
        label: "User",
        name: "name",
        component: inputComponents.TextField,
        icon: SearchRoundedIcon,
        required: true,
    },
    {
        label: "Member role(s)",
        name: "roles",
        component: inputComponents.Select,
        options: [],
        required: true,
    },
];

export {
    defaultValues as addTeamMemberDefaultValues,
    validationSchema as addTeamMemberValidationSchema,
    formFields as addTeamMemberFormFields,
};
