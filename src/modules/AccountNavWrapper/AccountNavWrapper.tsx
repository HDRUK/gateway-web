/** @jsxImportSource @emotion/react */

import { useTranslation } from "next-i18next";
import useDialog from "@/hooks/useDialog";
import Button from "@/components/Button";
import ProvidersDialog from "@/modules/dialogs/ProvidersDialog";
import { Box, CircularProgress } from "@mui/material";
import AccountNav from "@/modules/AccountNav";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useTheme } from "@emotion/react";
import InitialsBadge from "@/components/InitialsBadge";
import useAuth from "@/hooks/useAuth";
import useLogout from "@/hooks/useLogout";

const AccountNavWrapper = () => {
    const { showDialog } = useDialog();
    const logout = useLogout();
    const theme = useTheme();
    const { t } = useTranslation("components");
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(
        null
    );
    const { isLoggedIn, user, isLoading } = useAuth();

    const handleOpenNav = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElement(event.currentTarget);
    };

    const handleLogout = () => {
        logout();
    };

    if (isLoading) {
        return <CircularProgress color="secondary" />;
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
                            color: theme.palette.colors.grey800,
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
                    onLogout={handleLogout}
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
