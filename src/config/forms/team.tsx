import * as yup from "yup";
import { TeamForm } from "@/interfaces/Team";
import { getChipLabel } from "@/components/Autocomplete/utils";
import { memberOfOptions } from "@/consts/team";
import { inputComponents } from ".";

const defaultValues: TeamForm = {
    name: "",
    member_of: "",
    contact_point: "",
    users: [],
    notifications: [],
    enabled: true,
    allows_messaging: true,
    workflow_enabled: true,
    access_requests_management: true,
    uses_5_safes: true,
    is_question_bank: false,
    team_logo: "",
    introduction: "",
};

const validationSchema = yup.object({
    introduction: yup.string().nullable().label("Introduction"),
    name: yup.string().required().label("Organisation name"),
    member_of: yup.string().required().label("Member of"),
    contact_point: yup.string().email().label("Contact point"),
    users: yup
        .array()
        .min(1, "Team admin(s) is a required field")
        .of(yup.number())
        .label("Team admin(s)"),
});

const questionBankField = {
    name: "is_question_bank",
    component: inputComponents.Switch,
};

const formFields = [
    {
        label: "Introduction",
        name: "introduction",
        info: "Provide a description of the organisation and/or services for display on the Data Custodian landing page. Include formatting as it should render on the Gateway",
        component: inputComponents.Wysiwyg,
    },
    {
        label: "Organisation name",
        name: "name",
        info: "Please ensure the name matches the standard format for organsitation names",
        component: inputComponents.TextArea,
        required: true,
    },
    {
        label: "Member of",
        name: "member_of",
        component: inputComponents.Select,
        options: memberOfOptions,
        required: true,
    },
    {
        label: "Team admin",
        required: true,
        name: "users",
        selectOnFocus: true,
        clearOnBlur: true,
        handleHomeEndKeys: true,
        multiple: true,
        isOptionEqualToValue: (
            option: { value: string | number; label: string },
            value: string | number
        ) => option.value === value,
        getChipLabel,
        component: inputComponents.Autocomplete,
        info: "Assign at least one team admin. A team admin will be able to manage members, add new team members and manage the team notification preferences.",
    },
    {
        label: "Contact point",
        name: "contact_point",
        info: "Please provide a valid email address that can be used as a default.",
        component: inputComponents.TextField,
    },
];

export {
    questionBankField,
    defaultValues as teamDefaultValues,
    validationSchema as teamValidationSchema,
    formFields as teamFormFields,
};
