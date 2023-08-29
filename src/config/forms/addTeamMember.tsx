import * as yup from "yup";
import SearchIcon from "@mui/icons-material/SearchRounded";
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
        icon: SearchIcon,
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
