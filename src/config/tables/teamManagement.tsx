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
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { ColumnDef } from "@tanstack/react-table";

const CheckboxesCell = ({
    row: { index, original },
    table,
    requiredRoles,
    userRoles,
}) => {
    const { roles } = original;
    const checkboxes = requiredRoles.map(requiredRole => ({
        name: requiredRole,
        value: !!roles.find(role => role.name === requiredRole)?.enabled,
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
            {checkboxes.map(checkbox => (
                <FormControlLabel
                    key={checkbox.name}
                    label={rolesMeta[checkbox.name].label}
                    control={
                        <Checkbox
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

const getColumns = (userRoles: string[]): ColumnDef<User>[] => {
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
                    userRoles={userRoles}
                    requiredRoles={[
                        ROLE_CUSTODIAN_TEAM_ADMIN,
                        ROLE_CUSTODIAN_DEVELOPER,
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
                    userRoles={userRoles}
                    requiredRoles={[
                        ROLE_CUSTODIAN_DAR_MANAGER,
                        ROLE_CUSTODIAN_DAR_REVIEWER,
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
                    userRoles={userRoles}
                    requiredRoles={[
                        ROLE_CUSTODIAN_METADATA_MANAGER,
                        ROLE_CUSTODIAN_METADATA_EDITOR,
                    ]}
                />
            ),
        },
        ...(!userRoles.includes(ROLE_CUSTODIAN_TEAM_ADMIN)
            ? [
                  {
                      id: "furtherActions",
                      header: () => <Box textAlign="left">Actions</Box>,
                      size: 40,
                      cell: () => {
                          return (
                              <TableActionCell
                                  actions={[
                                      {
                                          icon: (
                                              <DeleteForeverIcon color="primary" />
                                          ),
                                          onClick: () => console.log("delete"),
                                      },
                                  ]}
                              />
                          );
                      },
                  },
              ]
            : []),
    ];
};

export { getColumns };
