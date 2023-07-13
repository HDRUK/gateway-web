/** @jsxImportSource @emotion/react */

import Link from "@/components/Link";
import { Box, Typography } from "@mui/material";

import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FolderSharedOutlinedIcon from "@mui/icons-material/FolderSharedOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import SchemaOutlinedIcon from "@mui/icons-material/SchemaOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Left in for next update for collapsable nav

import * as styles from "./LeftNav.styles";

function LeftNav() {
    const navItems = [
        // TODO: Update links when pages are available to do so
        { icon: <SettingsOutlinedIcon />, label: "Team Management", href: "#" },
        {
            icon: <FolderSharedOutlinedIcon />,
            label: "Your Profile",
            href: "/account/profile",
        },
        { icon: <StorageOutlinedIcon />, label: "Datasets", href: "#" },
        { icon: <SchemaOutlinedIcon />, label: "Data Uses", href: "#" },
        {
            icon: <DescriptionOutlinedIcon />,
            label: "Integrations",
            href: "/account/application",
            expandable: true,
        },
        { icon: <HelpOutlineOutlinedIcon />, label: "Help", href: "#" },
    ];

    return (
        <Box css={styles.navBox}>
            {navItems.map(item => (
                <Typography css={styles.navItem}>
                    {item.icon}
                    <Link
                        key={item.label}
                        href={item.href}
                        css={styles.navLink}>
                        {item.label}
                    </Link>
                    {item.expandable && (
                        <ChevronRightIcon
                            color="primary"
                            css={styles.expandIcon}
                        />
                    )}
                </Typography>
            ))}
        </Box>
    );
}

export default LeftNav;
