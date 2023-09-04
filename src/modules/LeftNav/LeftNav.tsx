/** @jsxImportSource @emotion/react */

import Link from "@/components/Link";
import {
    Box,
    Collapse,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import { colors } from "@/config/theme";
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

interface LeftNavProps {
    navItems: LeftNavItem[];
}

const LeftNav = ({ navItems }: LeftNavProps) => {
    const { asPath } = useRouter();
    const [expandedSection, setExpandedSection] = useState("");

    const toggleMenu = (item: LeftNavItem) => {
        const isOpen = isExpanded(item, expandedSection, asPath);
        if (isOpen && expandedSection !== item.label) return;
        setExpandedSection(isOpen ? "" : item.label);
    };

    return (
        <Box>
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

export default LeftNav;
