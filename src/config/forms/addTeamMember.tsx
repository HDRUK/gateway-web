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
import LabelAndDescription from "@/components/LabelAndDescription";
import { inputComponents } from ".";

const getRoleOptions = (permissions: { [key: string]: boolean }) => {
    return [
        ...(permissions[
            "fe.account.team_management.member.add.custodian_team_admin"
        ]
            ? [
                  {
                      label: "Team Admin",
                      labelComponent: (
                          <LabelAndDescription
                              label="Team Admin"
                              description="Can add or remove team members, and edit their roles."
                          />
                      ),
                      value: ROLE_CUSTODIAN_TEAM_ADMIN,
                  },
              ]
            : []),
        ...(permissions["fe.account.team_management.member.add.developer"]
            ? [
                  {
                      label: "Team Developer",
                      labelComponent: (
                          <LabelAndDescription
                              label="Team Developer"
                              description="Can develop, sample copy to be updated."
                          />
                      ),
                      value: ROLE_CUSTODIAN_DEVELOPER,
                  },
              ]
            : []),
        ...(permissions[
            "fe.account.team_management.member.add.custodian_metadata_manager"
        ]
            ? [
                  {
                      label: "Metadata Manager",
                      labelComponent: (
                          <LabelAndDescription
                              label="Metadata Manager"
                              description="Can create and edit dataset metadata, and edit team roles related to dataset metadata."
                          />
                      ),
                      value: ROLE_CUSTODIAN_METADATA_MANAGER,
                  },
              ]
            : []),
        ...(permissions["fe.account.team_management.member.add.metadata_editor"]
            ? [
                  {
                      label: "Metadata Editor",
                      labelComponent: (
                          <LabelAndDescription
                              label="Metadata Editor"
                              description="Can create and edit dataset metadata."
                          />
                      ),
                      value: ROLE_CUSTODIAN_METADATA_EDITOR,
                  },
              ]
            : []),
        ...(permissions[
            "fe.account.team_management.member.add.custodian_dar_manager"
        ]
            ? [
                  {
                      label: "Data Access Request Manager",
                      labelComponent: (
                          <LabelAndDescription
                              label="Data Access Request Manager"
                              description="Can review data access request applications, assign workflows to other team members, and edit team roles related to data access requests."
                          />
                      ),
                      value: ROLE_CUSTODIAN_DAR_MANAGER,
                  },
              ]
            : []),
        ...(permissions["fe.account.team_management.member.add.reviewer"]
            ? [
                  {
                      label: "Data Access Request Reviewer",
                      labelComponent: (
                          <LabelAndDescription
                              label="Data Access Request Reviewer"
                              description="Can review sections of data access request applications that have been assigned to them through workflows."
                          />
                      ),
                      value: ROLE_CUSTODIAN_DAR_REVIEWER,
                  },
              ]
            : []),
    ];
};

const defaultValues = {
    userAndRoles: [{ userId: undefined, roles: [] }],
};

const validationSchema = yup
    .object({
        userAndRoles: yup.array().of(
            yup.object().shape({
                userId: yup.number().required().label("User"),
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
        // name: "userId", replaced in component due to use of useFieldArray
        component: inputComponents.Autocomplete,
        icon: SearchRoundedIcon,
        noOptionsText: "No users found",
        required: true,
    },
    {
        label: "Member role(s)",
        // name: "roles", replaced in component due to use of useFieldArray
        component: inputComponents.Select,
        required: true,
        hasCheckbox: true,
        multiple: true,
    },
];

export {
    getRoleOptions,
    defaultValues as addTeamMemberDefaultValues,
    validationSchema as addTeamMemberValidationSchema,
    formFields as addTeamMemberFormFields,
};
