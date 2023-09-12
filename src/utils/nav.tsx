import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FolderSharedOutlinedIcon from "@mui/icons-material/FolderSharedOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import SchemaOutlinedIcon from "@mui/icons-material/SchemaOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { LeftNavItem } from "@/interfaces/Ui";

const getProfileNav = (): LeftNavItem[] => {
    return [
        {
            icon: <FolderSharedOutlinedIcon />,
            label: "Your Profile",
            href: "/account/profile",
        },
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
        ...(permissions["account.nav.datasets.read"]
            ? [
                  {
                      icon: <StorageOutlinedIcon />,
                      label: "Datasets",
                      href: `/account/team/${teamId}/datasets`,
                  },
              ]
            : []),
        ...([
            permissions["account.nav.dar.applications.read"],
            permissions["account.nav.dar.workflows.read"],
            permissions["account.nav.dar.editForm.read"],
        ].some(isTrue => isTrue)
            ? [
                  {
                      icon: <GroupsOutlinedIcon />,
                      label: "Data Access Requests",
                      subItems: [
                          ...(permissions["account.nav.dar.applications.read"]
                              ? [
                                    {
                                        label: "Applications",
                                        href: `/account/team/${teamId}/data-access-requests/applications`,
                                    },
                                ]
                              : []),
                          ...(permissions["account.nav.dar.workflows.read"]
                              ? [
                                    {
                                        label: "Workflows",
                                        href: `/account/team/${teamId}/data-access-requests/workflows`,
                                    },
                                ]
                              : []),
                          ...(permissions["account.nav.dar.editForm.read"]
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
        ...(permissions["account.nav.dur.read"]
            ? [
                  {
                      icon: <SchemaOutlinedIcon />,
                      label: "Data Uses",
                      href: `/account/team/${teamId}/data-uses/`,
                  },
              ]
            : []),
        ...(permissions["account.nav.integrations.read"]
            ? [
                  {
                      icon: <DescriptionOutlinedIcon />,
                      label: "Integrations",
                      subItems: [
                          {
                              label: "API management",
                              href: `/account/team/${teamId}/integrations/api-management`,
                          },
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
