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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import * as styles from "./LeftNav.styles";
import apis from "@/config/apis";
import useGet from "@/hooks/useGet";
import Loading from "@/components/Loading";
import { Team } from "@/interfaces/Team";
import BoxContainer from "@/components/BoxContainer";

interface LeftNavProps {
    teamId?: string | string[] | undefined;
}

const LeftNav = ({ teamId }: LeftNavProps) => {
    const { data: team, isLoading: isTeamLoading } = 
        useGet<Team>(`${apis.teamsV1Url}/${teamId}`);

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
            href:
                teamId === null
                    ? "null"
                    : `/account/team/${teamId}/app-management`,
            expandable: true,
        },
        { icon: <HelpOutlineOutlinedIcon />, label: "Help", href: "#" },
    ];

    // useEffect(() => {
    //     if (!team) {
    //         console.log('am here');
    //         return;
    //     }

    //     console.log(team);
    // }, [team]);

    if (isTeamLoading) { return <Loading /> };

    return (
        <Box css={styles.navBox}>
            <BoxContainer
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                }}>
                <Box>
                    <Typography>{team.name}</Typography>
                </Box>
                <Box>
                    <ExpandMoreIcon />
                </Box>
            </BoxContainer>
            {navItems.map(item => (
                <Typography css={styles.navItem} key={item.label}>
                    {item.href !== "null" && (
                        <>
                            {item.icon}
                            <Link
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
                        </>
                    )}
                </Typography>
            ))}
        </Box>
    );
};

LeftNav.defaultProps = {
    teamId: null,
};

export default LeftNav;
