/** @jsxImportSource @emotion/react */

import Link from "@/components/Link";
import useUser from "@/hooks/useUser";
import { useTranslation } from "next-i18next";
import useDialog from "@/hooks/useDialog";
import Button from "@/components/Button";
import SignInDialog from "@/modules/dialogs/SignInDialog";
import { Box, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccountNavigation from "@/modules/AccountNavigation";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useTheme } from "@emotion/react";
import * as styles from "./HeaderNav.styles";
import InitialsBadge from "../InitialsBadge";

function HeaderNav() {
    const { showDialog } = useDialog();
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(
        null
    );

    const theme = useTheme();
    const { t } = useTranslation("components");

    const { isLoggedIn, user } = useUser();
    const handleOpenNav = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElement(event.currentTarget);
    };

    const navItems = ["Explore", "Help", "Usage data", "About us"];
    const navLinks = [
        { label: "News", href: "/news" },
        { label: "Community", href: "/community" },
    ];

    return (
        <>
            <Box css={styles.navBox}>
                {navItems.map(item => (
                    <Typography key={item} css={styles.navItem}>
                        {item}
                        <ExpandMoreIcon color="primary" />
                    </Typography>
                ))}

                {/* news route andcommunity route to be implemented */}
                {navLinks.map(item => (
                    <Link
                        key={item.label}
                        href={item.href}
                        css={styles.navLink}>
                        {item.label}
                    </Link>
                ))}
            </Box>
            {isLoggedIn && (
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

                    <AccountNavigation
                        anchorElement={anchorElement}
                        onCloseMenu={() => setAnchorElement(null)}
                    />
                </>
            )}
            {!isLoggedIn && (
                <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={() => showDialog(SignInDialog)}>
                    {t("HeaderNav.labels.signIn")}
                </Button>
            )}
        </>
    );
}

export default HeaderNav;
