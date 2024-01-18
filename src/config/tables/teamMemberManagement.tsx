/* eslint-disable */
import { ReactNode, useMemo } from "react";
import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/interfaces/User";
import TableActionCell from "@/components/TableActionCell";
import TooltipIcon from "@/components/TooltipIcon";
import PermissionDescriptions from "@/modules/PermissionDescriptions";
import {
    ROLE_CUSTODIAN_DAR_MANAGER,
    ROLE_CUSTODIAN_DAR_REVIEWER,
    ROLE_CUSTODIAN_DEVELOPER,
    ROLE_CUSTODIAN_METADATA_EDITOR,
    ROLE_CUSTODIAN_METADATA_MANAGER,
    ROLE_CUSTODIAN_TEAM_ADMIN,
    rolesMeta,
} from "@/consts/roles";

const CheckboxesCell = ({
    row: { index, original },
    table,
    checkboxes,
    permissions,
    translations,
}) => {
    const { roles } = original;

    const isLastRole = useMemo(
        () => roles?.filter(role => role.enabled).length === 1,
        [roles]
    );

    const lastRoleMessage = permissions[
        "fe.account.team_management.permission.update.custodian_team_admin"
    ]
        ? translations.lastRoleAdminMessage
        : translations.lastRoleMessage;

    const checkboxesHydrated = useMemo(() => {
        return checkboxes.map(checkbox => {
            const value = !!roles?.find(role => role.name === checkbox.name)
                ?.enabled;
            return {
                name: checkbox.name,
                disabled: value && isLastRole ? true : checkbox.disabled,
                value,
                title:
                    value && isLastRole
                        ? lastRoleMessage
                        : checkbox.disabled
                        ? translations.noPermission
                        : "",
            };
        });
    }, [roles, checkboxes]);

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
                    title={checkbox.title}
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

const getColumns = ({
    translations,
    permissions,
    actions,
}: {
    translations: { [key: string]: string };
    permissions: { [key: string]: boolean };
    actions: {
        label?: string;
        onClick: (rowUser: User) => void;
        icon: ReactNode;
    }[];
}): ColumnDef<User>[] => {
    return [
        {
            id: "name",
            header: () => <Box textAlign="left">{translations.nameHeader}</Box>,
            accessorFn: row => `${row.firstname} ${row.lastname}`,
        },
        {
            id: "team",
            header: () => (
                <TooltipIcon
                    label={translations.teamHeader}
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
                    translations={translations}
                    permissions={permissions}
                    checkboxes={[
                        {
                            name: ROLE_CUSTODIAN_TEAM_ADMIN,
                            disabled:
                                !permissions[
                                    "fe.account.team_management.permission.update.custodian_team_admin"
                                ],
                        },
                        {
                            name: ROLE_CUSTODIAN_DEVELOPER,
                            disabled:
                                !permissions[
                                    "fe.account.team_management.permission.update.developer"
                                ],
                        },
                    ]}
                />
            ),
        },
        {
            id: "dataAccessRequest",
            header: () => (
                <TooltipIcon
                    label={translations.darHeader}
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
                    translations={translations}
                    permissions={permissions}
                    checkboxes={[
                        {
                            name: ROLE_CUSTODIAN_DAR_MANAGER,
                            disabled:
                                !permissions[
                                    "fe.account.team_management.permission.update.custodian_dar_manager"
                                ],
                        },
                        {
                            name: ROLE_CUSTODIAN_DAR_REVIEWER,
                            disabled:
                                !permissions[
                                    "fe.account.team_management.permission.update.reviewer"
                                ],
                        },
                    ]}
                />
            ),
        },
        {
            id: "metaData",
            header: () => (
                <TooltipIcon
                    label={translations.metaDataHeader}
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
                    translations={translations}
                    permissions={permissions}
                    checkboxes={[
                        {
                            name: ROLE_CUSTODIAN_METADATA_MANAGER,
                            disabled:
                                !permissions[
                                    "fe.account.team_management.permission.update.custodian_metadata_manager"
                                ],
                        },
                        {
                            name: ROLE_CUSTODIAN_METADATA_EDITOR,
                            disabled:
                                !permissions[
                                    "fe.account.team_management.permission.update.metadata_editor"
                                ],
                        },
                    ]}
                />
            ),
        },
        ...(permissions["fe.account.team_management.member.delete"]
            ? [
                  {
                      id: "furtherActions",
                      header: () => (
                          <Box textAlign="left">
                              {translations.actionsHeader}
                          </Box>
                      ),
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
