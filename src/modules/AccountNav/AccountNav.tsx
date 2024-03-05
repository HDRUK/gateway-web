"use client";

import { useState } from "react";
import { Box, Skeleton } from "@mui/material";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import InitialsBadge from "@/components/InitialsBadge";
import MenuDropdown from "@/components/MenuDropdown";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAccountMenu from "@/hooks/useAccountMenu";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";

const AccountNav = () => {
    const { showDialog } = useDialog();
    const t = useTranslations("components");
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(
        null
    );
    const { isLoggedIn, user, isLoading } = useAuth();
    const accountLinks = useAccountMenu();
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
                            color: "white",
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
                    menuItems={accountLinks}
                />
            </>
        );
    }

    return (
        <Button
            size="small"
            variant="outlined"
            color="secondary"
            sx={{
                color: "white",
            }}
            onClick={() => showDialog(ProvidersDialog)}>
            {t("DesktopNav.labels.signIn")}
        </Button>
    );
};

export default AccountNav;
