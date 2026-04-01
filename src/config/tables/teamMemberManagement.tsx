import { Box } from "@mui/material";
import { createColumnHelper } from "@tanstack/react-table";
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
    ROLE_CUSTODIAN_COHORT_MANAGER,
} from "@/consts/roles";
import PermissionCheckboxes from "@/app/[locale]/account/team/[teamId]/(withLeftNav)/team-management/components/PermissionCheckboxes";
import TableActionCell from "@/app/[locale]/account/team/[teamId]/(withLeftNav)/team-management/components/TableActionCell";

const columnHelper = createColumnHelper<User>();

export const ROLE_SECTIONS = [
    {
        id: "team",
        label: "teamHeader",
        roles: [
            {
                name: ROLE_CUSTODIAN_TEAM_ADMIN,
                permission: "roles.cta.update",
            },
            {
                name: ROLE_CUSTODIAN_DEVELOPER,
                permission: "roles.dev.update",
            },
        ],
    },
    {
        id: "dataAccessRequest",
        label: "darHeader",
        roles: [
            {
                name: ROLE_CUSTODIAN_DAR_MANAGER,
                permission: "roles.dar-m.update",
            },
            {
                name: ROLE_CUSTODIAN_DAR_REVIEWER,
                permission: "roles.dar-r.update",
            },
        ],
    },
    {
        id: "cohortDiscoveryAdmin",
        label: "cohortDiscoveryHeader",
        feature: "isCohortDiscoveryServiceEnabled",
        roles: [
            {
                name: ROLE_CUSTODIAN_COHORT_MANAGER,
                permission: null,
            },
        ],
    },
    {
        id: "metaData",
        label: "metaDataHeader",
        roles: [
            {
                name: ROLE_CUSTODIAN_METADATA_MANAGER,
                permission: "roles.mdm.update",
            },
            {
                name: ROLE_CUSTODIAN_METADATA_EDITOR,
                permission: "roles.mde.update",
            },
        ],
    },
];

const getColumns = ({
    translations,
    permissions,
    actions,
    features,
}: {
    translations: { [key: string]: string };
    permissions: { [key: string]: boolean };
    actions: {
        label?: string;
        onClick: (rowUser: User) => void;
        icon: IconType;
    }[];
    features: { [key: string]: boolean };
}) => {
    const roleColumns = ROLE_SECTIONS.filter(section =>
        section.feature ? features[section.feature] : true
    ).map(section =>
        columnHelper.display({
            id: section.id,
            header: () => (
                <TooltipIcon
                    label={translations[section.label]}
                    content={
                        <PermissionDescriptions
                            roles={section.roles.map(r => r.name)}
                        />
                    }
                />
            ),
            cell: props => (
                <PermissionCheckboxes
                    {...props}
                    translations={translations}
                    permissions={permissions}
                    checkboxes={section.roles.map(role => ({
                        name: role.name,
                        disabled: role.permission
                            ? !permissions[role.permission]
                            : false,
                    }))}
                />
            ),
        })
    );

    return [
        columnHelper.display({
            id: "name",
            header: () => <Box textAlign="left">{translations.nameHeader}</Box>,
            cell: ({ row }) =>
                row.original.firstname
                    ? `${row.original.firstname} ${row.original.lastname}`
                    : row.original.name,
        }),

        ...roleColumns,

        ...(permissions["team-members.delete"]
            ? [
                  columnHelper.display({
                      id: "furtherActions",
                      header: () => (
                          <Box textAlign="left">
                              {translations.actionsHeader}
                          </Box>
                      ),
                      size: 40,
                      cell: ({ row: { original } }) => (
                          <TableActionCell user={original} actions={actions} />
                      ),
                  }),
              ]
            : []),
    ];
};

export { getColumns };
