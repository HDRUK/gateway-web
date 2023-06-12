/** @jsxImportSource @emotion/react */

import useUser from "@/hooks/useUser";
import { useTranslation } from "next-i18next";
import useDialog from "@/hooks/useDialog";
import Button from "@/components/Button";
import SignInDialog from "@/modules/dialogs/SignInDialog";
import { Box } from "@mui/material";
import AccountNav from "@/modules/AccountNav";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useTheme } from "@emotion/react";
import InitialsBadge from "@/components/InitialsBadge";
import Loading from "@/components/Loading";

const AccountNavWrapper = () => {
    const { showDialog } = useDialog();
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(
        null
    );

    const theme = useTheme();
    const { t } = useTranslation("components");

    const { isLoggedIn, user, isLoading } = useUser();
    const handleOpenNav = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElement(event.currentTarget);
    };

    if (isLoading) return <Loading />;

    if (isLoggedIn) {
        return (
            <>
                <Box sx={{ display: "flex" }}>
                    <InitialsBadge fullName={user.name} />
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
                />
            </>
        );
    }

    return (
        <Button
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => showDialog(SignInDialog)}>
            {t("HeaderNav.labels.signIn")}
        </Button>
    );
};

export default AccountNavWrapper;
