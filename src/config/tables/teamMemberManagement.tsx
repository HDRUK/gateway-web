/* eslint-disable */
import { useMemo } from "react";
import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import {
    AccessorFn,
    RowData,
    Table,
    createColumnHelper,
} from "@tanstack/react-table";
import { IconType } from "@/interfaces/Ui";
import { User } from "@/interfaces/User";
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
import TableActionCell from "@/app/[locale]/account/team/[teamId]/team-management/components/TableActionCell";

interface CheckboxesCellProps {
    row: { original: User; index: number };
    translations: { [key: string]: string };
    permissions: { [key: string]: boolean };
    checkboxes: { name: string; disabled: boolean }[];
    table: Table<User>;
}

const CheckboxesCell = ({
    row: { index, original },
    table,
    checkboxes,
    permissions,
    translations,
}: CheckboxesCellProps) => {
    const { roles } = original;

    const isLastRole = useMemo(
        () => roles?.filter(role => role.enabled).length === 1,
        [roles]
    );

    const lastRoleMessage = permissions["roles.cta.update"]
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

    const handleUpdate = (name: string, value: boolean) => {
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

const columnHelper = createColumnHelper<User>();

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
        icon: IconType;
    }[];
}) => [
    columnHelper.display({
        id: "name",
        header: () => <Box textAlign="left">{translations.nameHeader}</Box>,
        cell: ({ row }) => `${row.original.firstname} ${row.original.lastname}`,
    }),
    columnHelper.display({
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
                        disabled: !permissions["roles.cta.update"],
                    },
                    {
                        name: ROLE_CUSTODIAN_DEVELOPER,
                        disabled: !permissions["roles.dev.update"],
                    },
                ]}
            />
        ),
    }),
    columnHelper.display({
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
                        disabled: !permissions["roles.dar-m.update"],
                    },
                    {
                        name: ROLE_CUSTODIAN_DAR_REVIEWER,
                        disabled: !permissions["roles.dar-r.update"],
                    },
                ]}
            />
        ),
    }),
    columnHelper.display({
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
                        disabled: !permissions["roles.mdm.update"],
                    },
                    {
                        name: ROLE_CUSTODIAN_METADATA_EDITOR,
                        disabled: !permissions["roles.mde.update"],
                    },
                ]}
            />
        ),
    }),
    ...(permissions["team-members.delete"]
        ? [
              columnHelper.display({
                  id: "furtherActions",
                  header: () => (
                      <Box textAlign="left">{translations.actionsHeader}</Box>
                  ),
                  size: 40,
                  cell: ({ row: { original } }) => {
                      return (
                          <TableActionCell user={original} actions={actions} />
                      );
                  },
              }),
          ]
        : []),
];

export { getColumns };
