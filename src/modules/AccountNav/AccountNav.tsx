"use client";

import { useState } from "react";
import { tokens } from "@hdruk/ui/theme";
import { Box, Skeleton } from "@mui/material";
import { useTranslations } from "next-intl";
import { Button } from "@hdruk/ui";
import InitialsBadge from "@/components/InitialsBadge";
import MenuDropdown from "@/components/MenuDropdown";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAccountMenu from "@/hooks/useAccountMenu";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";
import { useIsHomePage } from "@/hooks/useIsHomePage";

const AccountNav = () => {
    const { showDialog } = useDialog();
    const t = useTranslations("components");
    const isHomePage = useIsHomePage();
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(
        null
    );
    const { isLoggedIn, user, isLoading } = useAuth();
    const accountLinks = useAccountMenu();
    const menuItems = [accountLinks.myProfile, ...accountLinks.otherItems];

    const handleOpenNav = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElement(event.currentTarget);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Skeleton variant="circular" width={36} height={36} />
                <Skeleton variant="rectangular" width={80} height={20} />
            </Box>
        );
    }

    if (isLoggedIn) {
        return (
            <>
                <Box sx={{ display: "flex" }}>
                    <InitialsBadge fullName={user?.name} />
                    <Button
                        disableRipple
                        sx={{
                            marginLeft: "5px",
                            color: tokens.text.primaryWhite,

                            "&:focus&.Mui-focusVisible": {
                                outlineColor: tokens.background.white,
                                borderRadius: 0,
                                textDecoration: "underline",
                            },
                        }}
                        variant="text"
                        onClick={handleOpenNav}>
                        {user?.firstname}
                    </Button>
                </Box>
                <MenuDropdown
                    anchorElement={anchorElement}
                    handleClose={() => {
                        setAnchorElement(null);
                    }}
                    menuItems={menuItems}
                />
            </>
        );
    }

    return (
        <Button
            purpose={isHomePage ? "secondary" : "tertiary"}
            // The homepage header sits on the dark hero, so the label is forced
            // white there. Elsewhere `tertiary` supplies its own colour and
            // overriding it would put white text on a light fill.
            sx={isHomePage ? { color: tokens.text.primaryWhite } : undefined}
            onClick={() =>
                showDialog(ProvidersDialog, { isProvidersDialog: true })
            }>
            {t("DesktopNav.labels.signIn")}
        </Button>
    );
};

export default AccountNav;
