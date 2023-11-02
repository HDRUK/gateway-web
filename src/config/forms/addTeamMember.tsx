import * as yup from "yup";
import { SearchRoundedIcon } from "@/consts/icons";
import {
    ROLE_CUSTODIAN_DAR_MANAGER,
    ROLE_CUSTODIAN_DAR_REVIEWER,
    ROLE_CUSTODIAN_DEVELOPER,
    ROLE_CUSTODIAN_METADATA_EDITOR,
    ROLE_CUSTODIAN_METADATA_MANAGER,
    ROLE_CUSTODIAN_TEAM_ADMIN,
} from "@/consts/roles";
import { ListItemText, Typography } from "@mui/material";
import { inputComponents } from ".";

const Label = ({
    name,
    description,
}: {
    name: string;
    description: string;
}) => {
    return (
        <ListItemText
            sx={{
                textWrap: "wrap",
            }}
            primary={
                <Typography
                    sx={{
                        fontWeight: 700,
                    }}>
                    {name}
                </Typography>
            }
            secondary={
                <Typography
                    sx={{
                        fontSize: "11px",
                    }}>
                    {description}
                </Typography>
            }
        />
    );
};
const roleOptions = [
    {
        label: "Team Admin",
        labelComponent: (
            <Label
                name="Team Admin"
                description="Can add or remove team members, and edit their roles."
            />
        ),
        value: ROLE_CUSTODIAN_TEAM_ADMIN,
    },
    {
        label: "Team Developer",
        labelComponent: (
            <Label
                name="Team Developer"
                description="Can develop, sample copy to be updated."
            />
        ),
        value: ROLE_CUSTODIAN_DEVELOPER,
    },
    {
        label: "Metadata Manager",
        labelComponent: (
            <Label
                name="Metadata Manager"
                description="Can create and edit dataset metadata, and edit team roles related to dataset metadata."
            />
        ),
        value: ROLE_CUSTODIAN_METADATA_MANAGER,
    },
    {
        label: "Metadata Editor",
        labelComponent: (
            <Label
                name="Metadata Editor"
                description="Can create and edit dataset metadata."
            />
        ),
        value: ROLE_CUSTODIAN_METADATA_EDITOR,
    },
    {
        label: "Data Access Request Manager",
        labelComponent: (
            <Label
                name="Data Access Request Manager"
                description="Can review data access request applications, assign workflows to other team members, and edit team roles related to data access requests."
            />
        ),
        value: ROLE_CUSTODIAN_DAR_MANAGER,
    },
    {
        label: "Data Access Request Reviewer",
        labelComponent: (
            <Label
                name="Data Access Request Reviewer"
                description="Can review sections of data access request applications that have been assigned to them through workflows."
            />
        ),
        value: ROLE_CUSTODIAN_DAR_REVIEWER,
    },
];

const defaultValues = {
    userAndRoles: [{ userId: undefined, roles: [] }],
};

const validationSchema = yup
    .object({
        userAndRoles: yup.array().of(
            yup.object().shape({
                userId: yup.string().required().label("User"),
                roles: yup
                    .array()
                    .min(1, "Select at least one role")
                    .label("User"),
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
        options: roleOptions,
        required: true,
        hasCheckbox: true,
        multiple: true,
    },
];

export {
    roleOptions,
    defaultValues as addTeamMemberDefaultValues,
    validationSchema as addTeamMemberValidationSchema,
    formFields as addTeamMemberFormFields,
};
