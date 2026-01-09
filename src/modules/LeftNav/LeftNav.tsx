"use client";

import { Fragment, useId, useMemo, useState } from "react";
import React from "react";
import {
    Box,
    Collapse,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from "@mui/material";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { LeftNavItem } from "@/interfaces/Ui";
import Typography from "@/components/Typography";
import config from "@/config/config";
import theme, { colors } from "@/config/theme";
import {
    ExpandLessIcon,
    ExpandMoreIcon,
    PanelExpandIcon,
} from "@/consts/icons";
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
    navHeading?: string;
    permissions: { [key: string]: boolean };
    initialLeftNavOpen: boolean;
}

const ICON_SIZE = "18px";
const WIDTH_NAV_EXPANDED = 240;
const WIDTH_NAV = 52;

const LeftNav = ({
    permissions,
    teamId,
    navHeading,
    initialLeftNavOpen,
}: LeftNavProps) => {
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

    const [navOpen, setNavOpen] = useState<boolean>(initialLeftNavOpen);

    const setLeftNav = (open: boolean) => {
        setNavOpen(open);
        Cookies.set(config.LEFT_NAV_COOKIE, open.toString());
    };

    const easing = theme.transitions.easing[navOpen ? "easeOut" : "easeIn"];
    const duration =
        theme.transitions.duration[
            navOpen ? "enteringScreen" : "leavingScreen"
        ];

    const filterSidebarButtonStyles = {
        py: 1,
        px: 1,
        transition: theme.transitions.create("left", {
            easing,
            duration,
        }),
    };

    const opacityFadeStyles = {
        opacity: navOpen ? 1 : 0,
        transition: "opacity 0.3s",
    };

    const subNavItemSelected = (href: string) =>
        trimmedPathname === href || trimmedPathname.startsWith(`${href}/`);

    return (
        <Box>
            <Box
                sx={{
                    py: "5px",
                    pl: navOpen ? 2 : 0,
                    pr: navOpen ? 1 : 0,
                    display: "flex",
                    justifyContent: navOpen ? "space-between" : "center",
                    alignItems: "center",
                }}>
                <Typography
                    sx={{
                        visibility: navOpen ? "visible" : "hidden",
                        width: navOpen ? "auto" : 0,
                        height: navOpen ? "auto" : 0,
                        whiteSpace: "nowrap",
                        ...opacityFadeStyles,
                    }}
                    fontSize={15}>
                    {navHeading}
                </Typography>

                <IconButton
                    size="small"
                    onClick={() => setLeftNav(!navOpen)}
                    sx={filterSidebarButtonStyles}>
                    <PanelExpandIcon
                        sx={{
                            transform: `scaleX(${navOpen ? 1 : -1})`,
                            width: ICON_SIZE,
                            height: ICON_SIZE,
                        }}
                    />
                </IconButton>
            </Box>
            <Drawer
                open={navOpen}
                variant="persistent"
                anchor="left"
                sx={{
                    p: 0,
                    width: navOpen ? WIDTH_NAV_EXPANDED : WIDTH_NAV,
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                    "& .MuiDrawer-paper": {
                        width: WIDTH_NAV_EXPANDED,
                        position: "relative",
                        boxSizing: "border-box",
                        background: "none",
                        transition: theme.transitions.create(
                            ["width", "margin"],
                            {
                                easing: theme.transitions.easing.sharp,
                                duration: navOpen
                                    ? theme.transitions.duration.leavingScreen
                                    : theme.transitions.duration.enteringScreen,
                            }
                        ),
                        transform: "none !important",
                        visibility: "visible !important",
                    },
                    overflowX: "hidden",
                    transition: theme.transitions.create(["width", "margin"], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    visibility: "visible !important",
                    transform: "none !important",
                }}
                PaperProps={{
                    sx: {
                        boxShadow: "none",
                        border: 0,
                    },
                }}>
                <Divider />

                <List component="nav" sx={{ color: colors.grey800 }}>
                    {navItems.map(item => {
                        const sectionId = itemIds[item.label];
                        const expanded = isExpanded(
                            item,
                            expandedSection,
                            trimmedPathname
                        );

                        return !item.subItems ? (
                            <Tooltip
                                title={!navOpen ? item.label : ""}
                                placement="right"
                                slotProps={{
                                    popper: {
                                        modifiers: [
                                            {
                                                name: "offset",
                                                options: { offset: [0, -190] },
                                            },
                                        ],
                                    },
                                }}>
                                <ListItemButton
                                    component={Link}
                                    key={item.label}
                                    href={item.href || ""}
                                    passHref
                                    selected={item.href === trimmedPathname}
                                    aria-current={
                                        item.href === trimmedPathname
                                            ? "page"
                                            : undefined
                                    }
                                    sx={{
                                        paddingLeft: 1,
                                    }}>
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 32,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 18,
                                            color: colors.grey600,
                                        }}>
                                        {React.cloneElement(item.icon, {
                                            fontSize: "inherit",
                                        })}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        sx={{
                                            pointerEvents: navOpen
                                                ? "auto"
                                                : "none",
                                            ...opacityFadeStyles,
                                        }}
                                    />
                                </ListItemButton>
                            </Tooltip>
                        ) : (
                            <Fragment key={item.label}>
                                <Tooltip
                                    title={!navOpen ? item.label : ""}
                                    placement="right"
                                    slotProps={{
                                        popper: {
                                            modifiers: [
                                                {
                                                    name: "offset",
                                                    options: {
                                                        offset: [0, -190],
                                                    },
                                                },
                                            ],
                                        },
                                    }}>
                                    <ListItemButton
                                        onClick={() => {
                                            if (!navOpen) {
                                                setLeftNav(true);

                                                if (
                                                    !isExpanded(
                                                        item,
                                                        expandedSection,
                                                        trimmedPathname
                                                    )
                                                ) {
                                                    toggleMenu(item);
                                                }
                                            } else {
                                                toggleMenu(item);
                                            }
                                        }}
                                        component="button"
                                        sx={{
                                            width: "100%",
                                            paddingLeft: 1,
                                        }}
                                        aria-expanded={expanded}
                                        aria-controls={
                                            navOpen ? sectionId : undefined
                                        }
                                        id={`toggle-${sectionId}`}>
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 32,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 18,
                                                color: colors.grey600,
                                            }}>
                                            {React.cloneElement(item.icon, {
                                                fontSize: "inherit",
                                            })}
                                        </ListItemIcon>

                                        <ListItemText
                                            primary={item.label}
                                            sx={{
                                                pointerEvents: navOpen
                                                    ? "auto"
                                                    : "none",
                                                ...opacityFadeStyles,
                                            }}
                                        />
                                        {expanded ? (
                                            <ExpandLessIcon
                                                color="primary"
                                                sx={{
                                                    width: ICON_SIZE,
                                                    height: ICON_SIZE,
                                                }}
                                            />
                                        ) : (
                                            <ExpandMoreIcon
                                                color="primary"
                                                sx={{
                                                    width: ICON_SIZE,
                                                    height: ICON_SIZE,
                                                }}
                                            />
                                        )}
                                    </ListItemButton>
                                </Tooltip>

                                {navOpen && (
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
                                                    sx={{
                                                        p: 0,
                                                        color: colors.grey700,
                                                    }}
                                                    aria-current={
                                                        subNavItemSelected(
                                                            subItem.href
                                                        )
                                                            ? "page"
                                                            : undefined
                                                    }>
                                                    <ListItemText
                                                        sx={{
                                                            paddingLeft: "17px",
                                                            m: 0,
                                                            ml: 6,
                                                            py: 1.5,
                                                            px: 1,
                                                            borderLeft: `1px solid 
                                                            ${
                                                                subNavItemSelected(
                                                                    subItem.href
                                                                )
                                                                    ? colors.green400
                                                                    : colors.grey200
                                                            }`,
                                                        }}
                                                        primary={subItem.label}
                                                    />
                                                </ListItemButton>
                                            ))}
                                        </List>
                                    </Collapse>
                                )}
                            </Fragment>
                        );
                    })}
                </List>
            </Drawer>
        </Box>
    );
};

export default LeftNav;
