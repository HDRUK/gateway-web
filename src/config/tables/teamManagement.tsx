/* eslint-disable */

import PermissionDescriptions from "@/components/PermissionDescriptions";
import TableActionCell from "@/components/TableActionCell";
import TableTooltipCell from "@/components/TableTooltipCell";
import {
    ROLE_CUSTODIAN_DAR_MANAGER,
    ROLE_CUSTODIAN_DAR_REVIEWER,
    ROLE_CUSTODIAN_DEVELOPER,
    ROLE_CUSTODIAN_METADATA_EDITOR,
    ROLE_CUSTODIAN_METADATA_MANAGER,
    ROLE_CUSTODIAN_TEAM_ADMIN,
    rolesMeta,
} from "@/consts/roles";
import { User } from "@/interfaces/User";

import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";

import { ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";

const CheckboxesCell = ({ row: { index, original }, table, checkboxes }) => {
    const { roles } = original;
    const checkboxesHydrated = checkboxes.map(checkbox => ({
        name: checkbox.name,
        disabled: checkbox.disabled,
        value: !!roles.find(role => role.name === checkbox.name)?.enabled,
    }));

    const handleUpdate = (name, value) => {
        const filteredRoles = roles.filter(role => role.name !== name);

        table.options.meta?.updateData(index, "roles", [
            ...filteredRoles,
            {
                name,
                enabled: value,
            },
        ]);
    };

    return (
        <FormGroup>
            {checkboxesHydrated.map(checkbox => (
                <FormControlLabel
                    key={checkbox.name}
                    label={rolesMeta[checkbox.name].label}
                    control={
                        <Checkbox
                            disabled={checkbox.disabled}
                            sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                            disableRipple
                            name={checkbox.name}
                            checked={checkbox.value}
                            value={checkbox.value}
                            onChange={e =>
                                handleUpdate(checkbox.name, e.target.checked)
                            }
                        />
                    }
                />
            ))}
        </FormGroup>
    );
};

const getColumns = (
    permissions: { [key: string]: boolean },
    actions: {
        label?: string;
        onClick: (rowUser: User) => void;
        icon: ReactNode;
    }[]
): ColumnDef<User>[] => {
    return [
        {
            id: "name",
            header: () => <Box textAlign="left">Name</Box>,
            accessorFn: row => `${row.firstname} ${row.lastname}`,
        },
        {
            id: "team",
            header: () => (
                <TableTooltipCell
                    header="Team"
                    content={
                        <PermissionDescriptions
                            roles={[
                                ROLE_CUSTODIAN_TEAM_ADMIN,
                                ROLE_CUSTODIAN_DEVELOPER,
                            ]}
                        />
                    }
                />
            ),
            cell: props => (
                <CheckboxesCell
                    {...props}
                    checkboxes={[
                        {
                            name: ROLE_CUSTODIAN_TEAM_ADMIN,
                            disabled:
                                !permissions[
                                    "account.team_management.permission.update.custodian_team_admin"
                                ],
                        },
                        {
                            name: ROLE_CUSTODIAN_DEVELOPER,
                            disabled:
                                !permissions[
                                    "account.team_management.permission.update.developer"
                                ],
                        },
                    ]}
                />
            ),
        },
        {
            id: "dataAccessRequest",
            header: () => (
                <TableTooltipCell
                    header="Data Access Requests"
                    content={
                        <PermissionDescriptions
                            roles={[
                                ROLE_CUSTODIAN_DAR_MANAGER,
                                ROLE_CUSTODIAN_DAR_REVIEWER,
                            ]}
                        />
                    }
                />
            ),
            cell: props => (
                <CheckboxesCell
                    {...props}
                    checkboxes={[
                        {
                            name: ROLE_CUSTODIAN_DAR_MANAGER,
                            disabled:
                                !permissions[
                                    "account.team_management.permission.update.custodian_dar_manager"
                                ],
                        },
                        {
                            name: ROLE_CUSTODIAN_DAR_REVIEWER,
                            disabled:
                                !permissions[
                                    "account.team_management.permission.update.reviewer"
                                ],
                        },
                    ]}
                />
            ),
        },
        {
            id: "metaData",
            header: () => (
                <TableTooltipCell
                    header="MetaData"
                    content={
                        <PermissionDescriptions
                            roles={[
                                ROLE_CUSTODIAN_METADATA_MANAGER,
                                ROLE_CUSTODIAN_METADATA_EDITOR,
                            ]}
                        />
                    }
                />
            ),
            cell: props => (
                <CheckboxesCell
                    {...props}
                    checkboxes={[
                        {
                            name: ROLE_CUSTODIAN_METADATA_MANAGER,
                            disabled:
                                !permissions[
                                    "account.team_management.permission.update.custodian_metadata_manager"
                                ],
                        },
                        {
                            name: ROLE_CUSTODIAN_METADATA_EDITOR,
                            disabled:
                                !permissions[
                                    "account.team_management.permission.update.metadata_editor"
                                ],
                        },
                    ]}
                />
            ),
        },
        ...(permissions["account.team_management.member.delete"]
            ? [
                  {
                      id: "furtherActions",
                      header: () => <Box textAlign="left">Actions</Box>,
                      size: 40,
                      cell: ({ row: { original } }) => {
                          return (
                              <TableActionCell
                                  user={original}
                                  actions={actions}
                              />
                          );
                      },
                  },
              ]
            : []),
    ];
};

export { getColumns };
