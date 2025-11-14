"use client";

import { Fragment, useId, useMemo, useState } from "react";
import {
    Box,
    Collapse,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { LeftNavItem } from "@/interfaces/Ui";
import { colors } from "@/config/theme";
import { ExpandLessIcon, ExpandMoreIcon } from "@/consts/icons";
import { getTrimmedpathname } from "@/utils/general";
import { getProfileNav, getTeamNav } from "@/utils/nav";
import { useFeatures } from "@/providers/FeatureProvider";

const isExpanded = (
    item: LeftNavItem,
    expandedSection: string,
    trimmedPathname: string
) => {
    if (item.subItems?.some(subItem => trimmedPathname.includes(subItem.href)))
        return true;
    return expandedSection === item.label;
};

interface LeftNavProps {
    teamId?: string;
    permissions: { [key: string]: boolean };
}

const LeftNav = ({ permissions, teamId }: LeftNavProps) => {
    const features = useFeatures();

    const navItems = teamId
        ? getTeamNav(permissions, teamId, features)
        : getProfileNav(permissions);

    const params = useParams<{ locale: string }>();
    const pathname = usePathname() || "";
    const trimmedPathname = getTrimmedpathname(params?.locale || "", pathname);
    const [expandedSection, setExpandedSection] = useState("");

    const baseId = useId();

    const itemIds = useMemo(() => {
        return Object.fromEntries(
            navItems.map((item, index) => [item.label, `${baseId}-${index}`])
        );
    }, [navItems, baseId]);

    const toggleMenu = (item: LeftNavItem) => {
        const isOpen = isExpanded(item, expandedSection, trimmedPathname);
        if (isOpen && expandedSection !== item.label) return;
        setExpandedSection(isOpen ? "" : item.label);
    };

    return (
        <Box>
            <List component="nav" sx={{ marginTop: 4 }}>
                {navItems.map(item => {
                    const sectionId = itemIds[item.label];
                    const expanded = isExpanded(
                        item,
                        expandedSection,
                        trimmedPathname
                    );

                    return !item.subItems ? (
                        <ListItemButton
                            component={Link}
                            key={item.label}
                            href={item.href || ""}
                            passHref
                            selected={item.href === trimmedPathname}
                            sx={{ paddingLeft: 1, color: colors.grey700 }}>
                            <ListItemIcon sx={{ minWidth: "40px" }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    ) : (
                        <Fragment key={item.label}>
                            <ListItemButton
                                onClick={() => toggleMenu(item)}
                                component="button"
                                sx={{ width: "100%", paddingLeft: 1 }}
                                aria-expanded={expanded}
                                aria-controls={sectionId}
                                id={`toggle-${sectionId}`}>
                                <ListItemIcon sx={{ minWidth: "40px" }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                                {expanded ? (
                                    <ExpandLessIcon color="primary" />
                                ) : (
                                    <ExpandMoreIcon color="primary" />
                                )}
                            </ListItemButton>

                            <Collapse
                                in={expanded}
                                timeout="auto"
                                unmountOnExit
                                id={sectionId}
                                role="region"
                                aria-labelledby={`toggle-${sectionId}`}>
                                <List component="div" disablePadding>
                                    {item.subItems.map(subItem => (
                                        <ListItemButton
                                            component={Link}
                                            key={subItem.label}
                                            href={subItem.href}
                                            passHref
                                            selected={trimmedPathname.includes(
                                                subItem.href
                                            )}
                                            sx={{
                                                pl: 4,
                                                color: colors.grey700,
                                            }}>
                                            <ListItemText
                                                sx={{
                                                    paddingLeft: "17px",
                                                }}
                                                primary={subItem.label}
                                            />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        </Fragment>
                    );
                })}
            </List>
        </Box>
    );
};

export default LeftNav;
