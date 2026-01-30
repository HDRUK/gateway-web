"use client";

import { Fragment, useId, useMemo, useState } from "react";
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
    useMediaQuery,
} from "@mui/material";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Role } from "@/interfaces/Role";
import { LeftNavItem } from "@/interfaces/Ui";
import EllipsisCharacterLimit from "@/components/EllipsisCharacterLimit";
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
    roles?: Role[];
}

const ICON_SIZE = "18px";
const WIDTH_NAV_EXPANDED = 240;
const WIDTH_NAV = 52;

const LeftNav = ({
    permissions,
    teamId,
    navHeading,
    initialLeftNavOpen,
    roles,
}: LeftNavProps) => {
    const isMobile = useMediaQuery(theme.breakpoints.only("mobile"));
    const features = useFeatures();

    const navItems = teamId
        ? getTeamNav(permissions, teamId, features)
        : getProfileNav(permissions, roles);

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

    const [storedNavOpen, setStoredNavOpen] =
        useState<boolean>(initialLeftNavOpen);

    const [leftNavExpandedOnMobile, setLeftNavExpandedOnMobile] =
        useState<boolean>(false);

    const navOpen = isMobile ? true : storedNavOpen;

    const setLeftNav = (open: boolean) => {
        setStoredNavOpen(open);
        Cookies.set(config.LEFT_NAV_COOKIE, open.toString());
    };

    const easing = theme.transitions.easing[navOpen ? "easeOut" : "easeIn"];
    const duration =
        theme.transitions.duration[
            navOpen ? "enteringScreen" : "leavingScreen"
        ];

    const opacityFadeStyles = {
        opacity: navOpen ? 1 : 0,
        transition: "opacity 0.3s",
    };

    const subNavItemSelected = (href: string) =>
        trimmedPathname === href || trimmedPathname.startsWith(`${href}/`);

    const getIdxFromSubItem = (href: string) => {
        const subItemsIdx = navItems.flatMap((item, index) => {
            if (item.subItems) {
                return item.subItems.map(value => ({
                    value,
                    originalIndex: index,
                }));
            }
        });

        return subItemsIdx.find(x => x?.value.href == href)?.originalIndex;
    };

    const firstNavIdx = isMobile
        ? navItems.findIndex(item => item.href === trimmedPathname)
        : 0;

    const subIndexIdx = getIdxFromSubItem(trimmedPathname) ?? 0;

    const firstNavItem =
        firstNavIdx === -1 ? navItems[subIndexIdx] : navItems[firstNavIdx];

    const renderedLeftNav = navItems.map(item => {
        const sectionId = itemIds[item.label];
        const expanded = isExpanded(item, expandedSection, trimmedPathname);

        const calculateLeftBorder = (subItemHref: string) =>
            `1px solid 
                ${
                    subNavItemSelected(subItemHref)
                        ? colors.green400
                        : colors.grey200
                }`;

        return !item.subItems ? (
            <Tooltip
                title={!navOpen ? item.label : ""}
                placement="right"
                key={`tooltip_${item.label}`}
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
                    key={`button_${item.label}`}
                    href={item.href || ""}
                    passHref
                    selected={item.href === trimmedPathname}
                    aria-current={
                        item.href === trimmedPathname ? "page" : undefined
                    }
                    onClick={() => {
                        setLeftNavExpandedOnMobile(!leftNavExpandedOnMobile);
                    }}
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
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={item.label}
                        sx={{
                            pointerEvents: navOpen ? "auto" : "none",
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
                        aria-controls={navOpen ? sectionId : undefined}
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
                            {item.icon}
                        </ListItemIcon>

                        <ListItemText
                            primary={item.label}
                            sx={{
                                pointerEvents: navOpen ? "auto" : "none",
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
                                        subNavItemSelected(subItem.href)
                                            ? "page"
                                            : undefined
                                    }
                                    onClick={() => {
                                        setLeftNavExpandedOnMobile(
                                            !leftNavExpandedOnMobile
                                        );
                                    }}>
                                    <ListItemText
                                        sx={{
                                            m: 0,
                                            ml: 6,
                                            py: 1.5,
                                            px: 1,
                                            borderLeft: calculateLeftBorder(
                                                subItem.href
                                            ),
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
    });

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
                    maxWidth: WIDTH_NAV_EXPANDED,
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
                    {navHeading && (
                        <EllipsisCharacterLimit
                            characterLimit={28}
                            text={navHeading}
                        />
                    )}
                </Typography>

                {!isMobile && (
                    <IconButton
                        size="small"
                        onClick={() => setLeftNav(!navOpen)}
                        sx={{ p: 1 }}
                        aria-label={
                            navOpen
                                ? "Collapse navigation"
                                : "Expand navigation"
                        }>
                        <PanelExpandIcon
                            sx={{
                                transform: `scaleX(${navOpen ? 1 : -1})`,
                                width: ICON_SIZE,
                                height: ICON_SIZE,
                            }}
                        />
                    </IconButton>
                )}
            </Box>
            <Drawer
                open={navOpen}
                variant="persistent"
                anchor="left"
                sx={{
                    p: 0,
                    width: {
                        mobile: "100%",
                        tablet: navOpen ? WIDTH_NAV_EXPANDED : WIDTH_NAV,
                    },
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                    overflowX: "hidden",
                    transition: theme.transitions.create(["width"], {
                        easing: easing,
                        duration: duration,
                    }),
                    "& .MuiDrawer-paper": {
                        width: { mobile: "100%", tablet: WIDTH_NAV_EXPANDED },
                        position: "relative",
                        transform: "none !important",
                        visibility: "visible !important",
                        transition: theme.transitions.create(["width"], {
                            easing: easing,
                            duration: duration,
                        }),
                    },
                }}
                slotProps={{
                    paper: {
                        sx: { boxShadow: "none", border: 0 },
                    },
                }}>
                <Divider />
                <List component="nav" sx={{ color: colors.grey800 }}>
                    {isMobile ? (
                        <>
                            <Tooltip
                                title={!navOpen ? firstNavItem.label : ""}
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
                                    key="top"
                                    onClick={() => {
                                        setLeftNavExpandedOnMobile(
                                            !leftNavExpandedOnMobile
                                        );
                                    }}
                                    sx={{
                                        paddingLeft: 1,
                                        borderBottom: leftNavExpandedOnMobile
                                            ? ""
                                            : `2px solid  ${colors.green400}`,
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
                                        {firstNavItem.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={firstNavItem.label}
                                        sx={{
                                            pointerEvents: navOpen
                                                ? "auto"
                                                : "none",
                                            ...opacityFadeStyles,
                                        }}
                                    />
                                    {leftNavExpandedOnMobile ? (
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
                            <Collapse
                                in={leftNavExpandedOnMobile}
                                timeout="auto"
                                unmountOnExit
                                id="top"
                                role="region"
                                aria-labelledby="toggle-top">
                                {renderedLeftNav}
                            </Collapse>
                        </>
                    ) : (
                        renderedLeftNav
                    )}
                </List>
            </Drawer>
        </Box>
    );
};

export default LeftNav;
