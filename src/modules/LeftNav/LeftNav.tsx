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
    initialExpandLeftNavOnMobile: boolean;
}

const ICON_SIZE = "18px";
const WIDTH_NAV_EXPANDED = 240;
const WIDTH_NAV = 52;

const LeftNav = ({
    permissions,
    teamId,
    navHeading,
    initialLeftNavOpen,
    initialExpandLeftNavOnMobile,
}: LeftNavProps) => {
    const isMobile = useMediaQuery(theme.breakpoints.only("mobile"));
    const features = useFeatures();
    const tempPositions = permissions;
    const navItems = teamId
        ? getTeamNav(tempPositions, teamId, features)
        : getProfileNav(tempPositions);

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

    const navOpen = isMobile ? true : storedNavOpen;

    const setLeftNav = (open: boolean) => {
        setStoredNavOpen(open);
        Cookies.set(config.LEFT_NAV_COOKIE, open.toString());
    };

    const [navExpandedOnMobile, setNavExpandedOnMobile] = useState<boolean>(
        initialExpandLeftNavOnMobile
    );

    const setLeftNavExpandedOnMobile = (expanded: boolean) => {
        setNavExpandedOnMobile(expanded);
        Cookies.set(config.EXPAND_LEFT_NAV_ON_MOBILE, expanded.toString());
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
    const firstNavSectionId = itemIds[firstNavItem.label];

    const renderLeftNavItem = (item: LeftNavItem) => {
        const sectionId = itemIds[item.label];
        const expanded = isExpanded(item, expandedSection, trimmedPathname);
        const isFirstItem = firstNavItem === item;
        const componentType = isMobile && isFirstItem ? "button" : Link;
        const onClick = isFirstItem
            ? () => {
                  setLeftNavExpandedOnMobile(!navExpandedOnMobile);
              }
            : undefined;

        const expanders =
            isFirstItem &&
            isMobile &&
            (navExpandedOnMobile ? (
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
            ));

        return !item.subItems ? (
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
                    component={componentType}
                    key={item.label}
                    href={componentType === "button" ? "" : item.href || ""}
                    passHref
                    selected={item.href === trimmedPathname}
                    aria-current={
                        item.href === trimmedPathname ? "page" : undefined
                    }
                    sx={{
                        paddingLeft: 1,
                        width: "100%",
                    }}
                    onClick={onClick}
                    aria-expanded={
                        isFirstItem ? navExpandedOnMobile : undefined
                    }
                    aria-controls={
                        isFirstItem && navExpandedOnMobile
                            ? firstNavSectionId
                            : undefined
                    }
                    id={
                        isFirstItem ? `toggle-${firstNavSectionId}` : undefined
                    }>
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
                    {expanders}
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
                        onClick={
                            isFirstItem
                                ? onClick
                                : () => {
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
                                  }
                        }
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
                        {isMobile && isFirstItem ? (
                            expanders
                        ) : expanded ? (
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

                {navOpen &&
                    (!isMobile || (isMobile && navExpandedOnMobile)) && (
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
    };

    const renderedfirstNavItem = renderLeftNavItem(firstNavItem);

    const renderedLeftNav = navItems.map((item, index) => {
        if (item === firstNavItem) {
            return;
        }

        return renderLeftNavItem(item);
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
                    <Fragment key={firstNavItem.label}>
                        {firstNavItem && renderedfirstNavItem}
                    </Fragment>
                    {isMobile ? (
                        <Collapse
                            in={navExpandedOnMobile}
                            timeout="auto"
                            unmountOnExit
                            id={firstNavSectionId}
                            role="region"
                            aria-labelledby={`toggle-${firstNavSectionId}`}>
                            {renderedLeftNav}
                        </Collapse>
                    ) : (
                        renderedLeftNav
                    )}
                </List>
            </Drawer>
        </Box>
    );
};

export default LeftNav;
