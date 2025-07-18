"use client";

import * as React from "react";
import { hotjar } from "react-hotjar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";
import Link from "@/components/Link";
import MenuDropdown from "@/components/MenuDropdown";
import AccountNav from "@/modules/AccountNav";
import DesktopNav from "@/modules/DesktopNav";
import useAccountMenu from "@/hooks/useAccountMenu";
import { useIsHomePage } from "@/hooks/useIsHomePage";
import { StaticImages } from "@/config/images";
import navItems from "@/config/nav";
import { colors } from "@/config/theme";
import { MenuIcon } from "@/consts/icons";

function Header() {
    const isHome = useIsHomePage();
    const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID;
    const HOTJAR_VERSION = 6;
    const isTablet = useMediaQuery("(min-width:640px)");

    if (HOTJAR_ID && typeof window !== "undefined" && !hotjar.initialized()) {
        // eslint-disable-next-line radix
        hotjar.initialize(parseInt(HOTJAR_ID), HOTJAR_VERSION);
    }

    const [anchorElement, setAnchorElement] =
        React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElement(event.currentTarget);
    };

    const accountLinks = useAccountMenu();

    return (
        <AppBar position="static" color={isHome ? "transparent" : "primary"}>
            <Container maxWidth="desktop">
                <Toolbar
                    disableGutters
                    sx={{
                        pt: 1,
                        pb: 1,
                        justifyContent: {
                            tablet: "initial",
                        },
                    }}>
                    <Link
                        href="/"
                        sx={{
                            display: { mobile: "none", desktop: "flex" },
                            mr: 1,
                            "&:focus&.Mui-focusVisible": {
                                borderRadius: 0,
                                outline: `2px solid ${colors.white}`,
                                outlineOffset: "3px",
                            },
                        }}>
                        <Image
                            src={StaticImages.BASE.logo}
                            priority
                            width={110}
                            height={50}
                            alt="HDR UK Gateway"
                        />
                    </Link>
                    <Box
                        sx={{
                            display: { mobile: "flex", desktop: "none" },
                        }}>
                        <IconButton
                            size="large"
                            aria-label="navigation menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                            sx={{
                                "&:focus&.Mui-focusVisible": {
                                    borderRadius: 0,
                                    outline: `2px solid ${colors.white}`,
                                    outlineOffset: "3px",
                                },
                            }}>
                            <MenuIcon htmlColor="white" />
                        </IconButton>

                        <MenuDropdown
                            handleClose={() => setAnchorElement(null)}
                            menuItems={
                                isTablet
                                    ? navItems
                                    : [...navItems, ...accountLinks]
                            }
                            anchorElement={anchorElement}
                        />
                    </Box>
                    <Link
                        href="/"
                        sx={{
                            margin: { mobile: "auto" },
                            ml: { tablet: 2 },
                            flex: { tablet: 1 },
                            mr: { tablet: 1 },
                            position: { mobile: "relative" },
                            left: { mobile: "-24px", tablet: 0 },
                            display: { tablet: "flex", desktop: "none" },
                            "&:focus&.Mui-focusVisible": {
                                borderRadius: 0,
                                outline: `2px solid ${colors.white}`,
                                outlineOffset: "3px",
                            },
                        }}>
                        <Image
                            src={StaticImages.BASE.logo}
                            priority
                            width={110}
                            height={50}
                            alt="HDR Gateway logo"
                        />
                    </Link>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { mobile: "none", desktop: "flex" },
                        }}>
                        <DesktopNav />
                    </Box>

                    <Box
                        sx={{
                            justifySelf: "end",
                            flexGrow: 0,
                            display: { mobile: "none", tablet: "flex" },
                        }}>
                        <AccountNav />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Header;
