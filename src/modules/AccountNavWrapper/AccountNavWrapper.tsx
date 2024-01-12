"use client";

import { useState } from "react";
import { Box, Skeleton } from "@mui/material";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import InitialsBadge from "@/components/InitialsBadge";
import ProvidersDialog from "@/modules/ProvidersDialog";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";
import { colors } from "@/config/theme";
import { ArrowDropDownIcon } from "@/consts/icons";
import AccountNav from "../AccountNav";

const AccountNavWrapper = () => {
    const { showDialog } = useDialog();
    const t = useTranslations("components");
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(
        null
    );
    const { isLoggedIn, user, isLoading } = useAuth();

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
                            color: colors.grey800,
                        }}
                        variant="text"
                        onClick={handleOpenNav}>
                        {user?.firstname}
                        <ArrowDropDownIcon color="primary" />
                    </Button>
                </Box>
                <AccountNav
                    anchorElement={anchorElement}
                    onCloseMenu={() => setAnchorElement(null)}
                />
            </>
        );
    }

    return (
        <Button
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => showDialog(ProvidersDialog)}>
            {t("HeaderNav.labels.signIn")}
        </Button>
    );
};

export default AccountNavWrapper;
