import * as yup from "yup";
import { SearchRoundedIcon } from "@/consts/icons";
import { inputComponents } from ".";

const defaultValues = {
    userAndRoles: [{ userId: null, roles: [] }],
};

const validationSchema = yup
    .object({
        userAndRoles: yup.array().of(
            yup.object().shape({
                userId: yup.string().required().label("User"),
                roles: yup.array().min(1, "at least one role").label("User"),
            })
        ),
    })
    .required();

const formFields = [
    {
        label: "User",
        // name: "userId", replaced in component due to useFieldArray
        component: inputComponents.Autocomplete,
        icon: SearchRoundedIcon,
        noOptionsText: "No users found",
        required: true,
    },
    {
        label: "Member role(s)",
        // name: "roles", replaced in component due to useFieldArray
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
