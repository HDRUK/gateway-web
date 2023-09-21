/** @jsxImportSource @emotion/react */

import Link from "@/components/Link";
import { Box } from "@mui/material";
import Button from "@/components/Button";
import { useState } from "react";
import { ExpandMoreIcon } from "@/consts/icons";
import * as styles from "./HeaderNav.styles";
import Dropdown from "../HeaderNavDropdown";

interface HeaderNavProps {
    showNavList: boolean;
}

function HeaderNav({ showNavList }: HeaderNavProps) {
    const navItems = [
        {
            label: "Explore",
            dropMenus: [
                {
                    label: "Datasets",
                    href: "#",
                    subtext: "Information about datasets available",
                },
                {
                    label: "Tools",
                    href: "#",
                    subtext: "Software, scripts, any useful resources",
                },
                {
                    label: "Projects",
                    href: "#",
                    subtext: "Projects approved by data custodians",
                },
                {
                    label: "Papers",
                    href: "#",
                    subtext: "Pre-prints, papers and articles",
                },
                {
                    label: "Courses",
                    href: "#",
                    subtext: "Courses and qualifications",
                },
                {
                    label: "People",
                    href: "#",
                    subtext: "Users with an account on the Gateway",
                },
                {
                    label: "Cohort Discovery",
                    href: "#",
                    subtext:
                        "Remote querying on multiple clinical databases in situ",
                },
                {
                    label: "Data Utility Wizard",
                    href: "#",
                    subtext: "Improves accuracy of searches for datasets",
                },
            ],
        },
        {
            label: "Help",
            dropMenus: [
                { label: "test3", href: "/test3" },
                { label: "test4", href: "/test4" },
            ],
        },
        {
            label: "Usage data",
            dropMenus: [
                { label: "test5", href: "/test5" },
                { label: "test6", href: "/test6" },
            ],
        },
        {
            label: "About us",
            dropMenus: [
                {
                    label: "Our mission and purpose",
                    href: "/about/our-mission-and-purpose",
                },
            ],
        },
    ];
    const navLinks = [
        { label: "Releases", href: "/about/releases" },
        { label: "News", href: "/news" },
        { label: "Community", href: "/community" },
    ];

    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(
        null
    );
    const [subMenu, setSubMenu] = useState<
        undefined | { label: string; href: string }[]
    >();

    const handleOpenNav = (
        event: React.MouseEvent<HTMLElement>,
        dropMenus: { label: string; href: string }[] | undefined
    ) => {
        setAnchorElement(event.currentTarget);
        if (dropMenus) {
            setSubMenu(dropMenus);
        } else {
            setSubMenu(undefined);
        }
    };

    return (
        <>
            <Box css={showNavList ? styles.navBoxMobile : styles.navBox}>
                {navItems.map(item => (
                    <Button
                        variant="text"
                        disableRipple
                        key={item.label}
                        onClick={event => handleOpenNav(event, item.dropMenus)}
                        css={styles.navItem}>
                        {item.label}
                        <ExpandMoreIcon
                            color="primary"
                            sx={{
                                "@media (max-width: 1023px)": {
                                    rotate: "-90deg",
                                },
                            }}
                        />
                    </Button>
                ))}

                {/* news route andcommunity route to be implemented */}
                <div css={styles.navLinkWrapper}>
                    {navLinks.map(item => (
                        <Link
                            key={item.label}
                            href={item.href}
                            css={styles.navLink}>
                            {item.label}
                        </Link>
                    ))}
                </div>
            </Box>
            {subMenu && subMenu.length > 0 && (
                <Dropdown
                    dropMenus={subMenu}
                    anchorElement={anchorElement}
                    onCloseMenu={() => setAnchorElement(null)}
                />
            )}
        </>
    );
}

export default HeaderNav;
