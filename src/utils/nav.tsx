import { LeftNavItem } from "@/interfaces/Ui";
import {
    DescriptionOutlinedIcon,
    FolderSharedOutlinedIcon,
    GroupsOutlinedIcon,
    HelpOutlineOutlinedIcon,
    SchemaOutlinedIcon,
    SettingsOutlinedIcon,
    StorageOutlinedIcon,
} from "@/consts/icons";

const getProfileNav = (permissions: {
    [key: string]: boolean;
}): LeftNavItem[] => {
    console.log(permissions);
    return [
        {
            icon: <FolderSharedOutlinedIcon />,
            label: "Your Profile",
            href: "/account/profile",
        },
        ...(permissions["cohort.read"]
            ? [
                  {
                      icon: <DescriptionOutlinedIcon />,
                      label: "Cohort Discovery Admin",
                      href: `/account/cohort-discovery-admin`,
                  },
              ]
            : []),
    ];
};

const getTeamNav = (
    permissions: {
        [key: string]: boolean;
    },
    teamId: string | undefined
): LeftNavItem[] => {
    return [
        {
            icon: <SettingsOutlinedIcon />,
            label: "Team Management",
            href: `/account/team/${teamId}/team-management`,
        },
        ...(permissions["fe.account.nav.datasets"]
            ? [
                  {
                      icon: <StorageOutlinedIcon />,
                      label: "Datasets",
                      href: `/account/team/${teamId}/datasets`,
                  },
              ]
            : []),
        ...([
            permissions["fe.account.nav.dar.applications"],
            permissions["fe.account.nav.dar.workflows"],
            permissions["fe.account.nav.dar.editForm"],
        ].some(isTrue => isTrue)
            ? [
                  {
                      icon: <GroupsOutlinedIcon />,
                      label: "Data Access Requests",
                      subItems: [
                          ...(permissions["fe.account.nav.dar.applications"]
                              ? [
                                    {
                                        label: "Applications",
                                        href: `/account/team/${teamId}/data-access-requests/applications`,
                                    },
                                ]
                              : []),
                          ...(permissions["fe.account.nav.dar.workflows"]
                              ? [
                                    {
                                        label: "Workflows",
                                        href: `/account/team/${teamId}/data-access-requests/workflows`,
                                    },
                                ]
                              : []),
                          ...(permissions["fe.account.nav.dar.editForm"]
                              ? [
                                    {
                                        label: "Edit Form",
                                        href: `/account/team/${teamId}/data-access-requests/edit-form`,
                                    },
                                ]
                              : []),
                      ],
                  },
              ]
            : []),
        ...(permissions["fe.account.nav.dur"]
            ? [
                  {
                      icon: <SchemaOutlinedIcon />,
                      label: "Data Uses",
                      href: `/account/team/${teamId}/data-uses/`,
                  },
              ]
            : []),
        ...([
            permissions["fe.account.nav.integrations.api-management"],
            permissions["fe.account.nav.integrations.integration"],
        ].some(isTrue => isTrue)
            ? [
                  {
                      icon: <DescriptionOutlinedIcon />,
                      label: "Integrations",
                      subItems: [
                          ...(permissions[
                              "fe.account.nav.integrations.api-management"
                          ]
                              ? [
                                    {
                                        label: "API management",
                                        href: `/account/team/${teamId}/integrations/api-management`,
                                    },
                                ]
                              : []),
                          ...(permissions[
                              "fe.account.nav.integrations.integration"
                          ]
                              ? [
                                    {
                                        label: "Integration",
                                        href: `/account/team/${teamId}/integrations/integration`,
                                    },
                                ]
                              : []),
                      ],
                  },
              ]
            : []),
        {
            icon: <HelpOutlineOutlinedIcon />,
            label: "Help",
            href: `/account/team/${teamId}/help`,
        },
    ];
};

export { getTeamNav, getProfileNav };
