/** @jsxImportSource @emotion/react */

import Link from "@/components/Link";
import {
    Box,
    Collapse,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FolderSharedOutlinedIcon from "@mui/icons-material/FolderSharedOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import SchemaOutlinedIcon from "@mui/icons-material/SchemaOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import apis from "@/config/apis";
import useGet from "@/hooks/useGet";
import Loading from "@/components/Loading";
import { Team } from "@/interfaces/Team";
import BoxContainer from "@/components/BoxContainer";

import { Fragment, ReactNode, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { colors } from "@/config/theme";

interface ListItem {
    icon: ReactNode;
    label: string;
    href?: string;
    subItems?: { label: string; href: string }[];
}

const isExpanded = (
    item: ListItem,
    expandedSection: string,
    asPath: string
) => {
    if (item.subItems?.some(subItem => asPath.includes(subItem.href)))
        return true;
    return expandedSection === item.label;
};

const LeftNav = () => {
    const [expandedSection, setExpandedSection] = useState("");

    const { query, asPath } = useRouter();
    const { teamId } = query;
    const { data: team, isLoading: isTeamLoading } = useGet<Team>(
        `${apis.teamsV1Url}/${teamId}`,
        { shouldFetch: !!teamId }
    );

    const isTeam = useMemo(() => !!teamId, [teamId]);

    const profileNav: ListItem[] = [
        {
            icon: <FolderSharedOutlinedIcon />,
            label: "Your Profile",
            href: "/account/profile",
        },
    ];

    const teamNav: ListItem[] = [
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

    const navItems = isTeam ? teamNav : profileNav;

    const toggleMenu = (item: ListItem) => {
        const isOpen = isExpanded(item, expandedSection, asPath);
        if (isOpen && expandedSection !== item.label) return;
        setExpandedSection(isOpen ? "" : item.label);
    };

    if (isTeamLoading) {
        return <Loading />;
    }

    return (
        <Box>
            {isTeam && (
                <BoxContainer
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}>
                    <Box>
                        <Typography>{team?.name}</Typography>
                    </Box>
                </BoxContainer>
            )}
            <List component="nav" sx={{ marginTop: 4 }}>
                {navItems.map(item =>
                    !item.subItems ? (
                        <Link
                            key={item.label}
                            href={item.href || ""}
                            passHref
                            underline="none"
                            sx={{ color: colors.grey700 }}>
                            <ListItemButton
                                selected={item.href?.includes(asPath)}
                                sx={{ paddingLeft: 1 }}>
                                <ListItemIcon sx={{ minWidth: "40px" }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </Link>
                    ) : (
                        <Fragment key={item.label}>
                            <ListItemButton
                                onClick={() => toggleMenu(item)}
                                component="button"
                                sx={{ width: "100%", paddingLeft: 1 }}>
                                <ListItemIcon sx={{ minWidth: "40px" }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                                {item.subItems &&
                                isExpanded(item, expandedSection, asPath) ? (
                                    <ExpandLess />
                                ) : (
                                    <ExpandMore />
                                )}
                            </ListItemButton>
                            <Collapse
                                in={isExpanded(item, expandedSection, asPath)}
                                timeout="auto"
                                unmountOnExit>
                                <List component="div" disablePadding>
                                    {item.subItems.map(subItem => {
                                        return (
                                            <Link
                                                sx={{ color: colors.grey700 }}
                                                underline="none"
                                                key={subItem.label}
                                                href={subItem.href}
                                                passHref>
                                                <ListItemButton
                                                    selected={subItem.href?.includes(
                                                        asPath
                                                    )}
                                                    sx={{ pl: 4 }}>
                                                    <ListItemText
                                                        sx={{
                                                            paddingLeft: "17px",
                                                        }}
                                                        primary={subItem.label}
                                                    />
                                                </ListItemButton>
                                            </Link>
                                        );
                                    })}
                                </List>
                            </Collapse>
                        </Fragment>
                    )
                )}
            </List>
        </Box>
    );
};

LeftNav.defaultProps = {
    teamId: null,
};

export default LeftNav;
