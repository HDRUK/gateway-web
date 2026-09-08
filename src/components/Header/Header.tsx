"use client";

import * as React from "react";
import { hotjar } from "react-hotjar";
import { tokens } from "@hdruk/ui/theme";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "@/components/Link";
import MenuDropdown from "@/components/MenuDropdown";
import AccountNav from "@/modules/AccountNav";
import DesktopNav from "@/modules/DesktopNav";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAccountMenu from "@/hooks/useAccountMenu";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";
import { useIsHomePage } from "@/hooks/useIsHomePage";
import { StaticImages } from "@/config/images";
import navItems from "@/config/nav";
import { MenuIcon } from "@/consts/icons";

function Header() {
    const isHome = useIsHomePage();
    const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID;
    const HOTJAR_VERSION = 6;
    const isTablet = useMediaQuery("(min-width:640px)");
    const { isLoggedIn } = useAuth();
    const { showDialog } = useDialog();
    const t = useTranslations("components");

    if (HOTJAR_ID && typeof window !== "undefined" && !hotjar.initialized()) {
        hotjar.initialize(parseInt(HOTJAR_ID), HOTJAR_VERSION);
    }

    const [anchorElement, setAnchorElement] =
        React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElement(event.currentTarget);
    };

    const accountLinks = useAccountMenu();

    const signInNav = [
        {
            label: t("DesktopNav.labels.signIn"),
            action: () => {
                setAnchorElement(null);
                showDialog(ProvidersDialog, { isProvidersDialog: true });
            },
        },
    ];

    const menuItems = [
        ...(!isLoggedIn ? signInNav : [accountLinks.myProfile]),
        ...navItems,
        ...(isLoggedIn ? accountLinks.otherItems : []),
    ];

    return (
        <AppBar position="static" color={isHome ? "transparent" : "primary"}>
            <Container maxWidth="lg">
                <Toolbar
                    disableGutters
                    sx={{
                        pt: 1,
                        pb: 1,
                        justifyContent: {
                            sm: "initial",
                        },
                    }}>
                    <Link
                        href="/"
                        sx={{
                            display: { xs: "none", lg: "flex" },
                            mr: 1,
                            "&:focus&.Mui-focusVisible": {
                                borderRadius: 0,
                                outline: `2px solid ${tokens.background.white}`,
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
                            display: { xs: "flex", lg: "none" },
                        }}>
                        <IconButton
                            size="large"
                            aria-label="navigation menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                            sx={{
                                color: tokens.text.primaryWhite,
                                "&:hover, &:focus-visible": {
                                    color: "primary.main",
                                },
                                "&:focus&.Mui-focusVisible": {
                                    borderRadius: 0,
                                    outline: `2px solid ${tokens.background.white}`,
                                    outlineOffset: "3px",
                                },
                            }}>
                            <MenuIcon />
                        </IconButton>

                        <MenuDropdown
                            handleClose={() => setAnchorElement(null)}
                            menuItems={menuItems}
                            anchorElement={anchorElement}
                        />
                    </Box>
                    <Link
                        href="/"
                        sx={{
                            margin: { xs: "auto" },
                            ml: { sm: 2 },
                            flex: { sm: 1 },
                            mr: { sm: 1 },
                            position: { xs: "relative" },
                            left: { xs: "-24px", sm: 0 },
                            display: { sm: "flex", lg: "none" },
                            "&:focus&.Mui-focusVisible": {
                                borderRadius: 0,
                                outline: `2px solid ${tokens.background.white}`,
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
                            display: { xs: "none", lg: "flex" },
                        }}>
                        <DesktopNav />
                    </Box>

                    <Box
                        sx={{
                            justifySelf: "end",
                            flexGrow: 0,
                            display: { xs: "none", sm: "flex" },
                        }}>
                        <AccountNav />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Header;
