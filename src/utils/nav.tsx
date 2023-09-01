import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FolderSharedOutlinedIcon from "@mui/icons-material/FolderSharedOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import SchemaOutlinedIcon from "@mui/icons-material/SchemaOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { LeftNavItem } from "@/interfaces/Ui";

const getNavItems = (isTeam: boolean, teamId: string) => {
    const profileNav: LeftNavItem[] = [
        {
            icon: <FolderSharedOutlinedIcon />,
            label: "Your Profile",
            href: "/account/profile",
        },
    ];

    const teamNav: LeftNavItem[] = [
        {
            icon: <SettingsOutlinedIcon />,
            label: "Team Management",
            href: `/account/team/${teamId}/team-management`,
        },
        {
            icon: <StorageOutlinedIcon />,
            label: "Datasets",
            href: `/account/team/${teamId}/datasets`,
        },
        {
            icon: <GroupsOutlinedIcon />,
            label: "Data Access Requests",
            subItems: [
                {
                    label: "Applications",
                    href: `/account/team/${teamId}/data-access-requests/applications`,
                },
                {
                    label: "Workflows",
                    href: `/account/team/${teamId}/data-access-requests/workflows`,
                },
                {
                    label: "Edit Form",
                    href: `/account/team/${teamId}/data-access-requests/edit-form`,
                },
            ],
        },
        {
            icon: <SchemaOutlinedIcon />,
            label: "Data Uses",
            href: `/account/team/${teamId}/data-uses/`,
        },
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
        {
            icon: <HelpOutlineOutlinedIcon />,
            label: "Help",
            href: `/account/team/${teamId}/help`,
        },
    ];

    return isTeam ? teamNav : profileNav;
};

export { getNavItems };
