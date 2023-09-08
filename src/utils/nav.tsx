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
    roles: {
        isCustodianDeveloper: boolean;
        isCustodianTeamAdmin: boolean;
        isCustodianMetadataManager: boolean;
        isCustodianMetadataEditor: boolean;
        isCustodianDarManager: boolean;
        isCustodianDarReviewer: boolean;
    },
    teamId: string | undefined
): LeftNavItem[] => {
    const {
        isCustodianDeveloper,
        isCustodianTeamAdmin,
        isCustodianMetadataManager,
        isCustodianMetadataEditor,
        isCustodianDarManager,
        isCustodianDarReviewer,
    } = roles;

    return [
        {
            icon: <SettingsOutlinedIcon />,
            label: "Team Management",
            href: `/account/team/${teamId}/team-management`,
        },
        ...([isCustodianMetadataEditor, isCustodianMetadataManager].some(
            isTrue => isTrue
        )
            ? [
                  {
                      icon: <StorageOutlinedIcon />,
                      label: "Datasets",
                      href: `/account/team/${teamId}/datasets`,
                  },
              ]
            : []),
        ...([isCustodianDarManager, isCustodianDarReviewer].some(
            isTrue => isTrue
        )
            ? [
                  {
                      icon: <GroupsOutlinedIcon />,
                      label: "Data Access Requests",
                      subItems: [
                          {
                              label: "Applications",
                              href: `/account/team/${teamId}/data-access-requests/applications`,
                          },
                          ...([isCustodianDarManager].some(isTrue => isTrue)
                              ? [
                                    {
                                        label: "Workflows",
                                        href: `/account/team/${teamId}/data-access-requests/workflows`,
                                    },
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
        ...([isCustodianDarManager].some(isTrue => isTrue)
            ? [
                  {
                      icon: <SchemaOutlinedIcon />,
                      label: "Data Uses",
                      href: `/account/team/${teamId}/data-uses/`,
                  },
              ]
            : []),
        ...([isCustodianTeamAdmin, isCustodianDeveloper].some(isTrue => isTrue)
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
