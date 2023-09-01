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

import apis from "@/config/apis";
import useGet from "@/hooks/useGet";
import Loading from "@/components/Loading";
import { Team } from "@/interfaces/Team";
import BoxContainer from "@/components/BoxContainer";

import { Fragment, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { colors } from "@/config/theme";
import { getNavItems } from "@/utils/nav";
import { LeftNavItem } from "@/interfaces/Ui";

const isExpanded = (
    item: LeftNavItem,
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

    const navItems = useMemo(() => {
        return getNavItems(isTeam, teamId);
    }, [isTeam, teamId]);

    const toggleMenu = (item: LeftNavItem) => {
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
