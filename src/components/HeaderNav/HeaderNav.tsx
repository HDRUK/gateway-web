/** @jsxImportSource @emotion/react */

import Link from "@/components/Link";
import useUser from "@/hooks/useUser";
import { useTranslation } from "next-i18next";
import useDialog from "@/hooks/useDialog";
import Button from "@/components/Button";
import SignInDialog from "@/modules/dialogs/SignInDialog";
import { Box, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Loading from "../Loading";
import * as styles from "./HeaderNav.styles";

interface LinkItem {
    label: string;
    href: string;
}

function HeaderNav() {
    const { showDialog } = useDialog();

    const { t } = useTranslation("components");

    const { isLoggedIn, isLoading } = useUser();

    const loggedInLinks: LinkItem[] = [
        {
            label: t("HeaderNav.labels.myAccount"),
            href: "/account",
        },
    ];

    const navItems = ["Explore", "Help", "Usage data", "About us"];
    const navLinks = [
        { label: "News", href: "/news" },
        { label: "Community", href: "/community" },
    ];

    if (isLoading) return <Loading />;

    return (
        <>
            <Box css={styles.navBox}>
                {navItems.map(item => (
                    <Typography css={styles.navItem}>
                        {item}
                        <ExpandMoreIcon sx={{ fill: "#475DA7" }} />
                    </Typography>
                ))}

                {/* news route andcommunity route to be implemented */}
                {navLinks.map(item => (
                    <Link
                        href={item.href}
                        label={item.label}
                        css={styles.navLink}
                    />
                ))}
            </Box>
            {isLoggedIn && (
                <ul
                    style={{
                        display: "inline-block",
                        listStyle: "none",
                    }}>
                    {loggedInLinks.map(link => (
                        <li
                            key={link.href}
                            style={{
                                display: "inline-block",
                                paddingLeft: "10px",
                            }}>
                            <Link href={link.href} label={link.label} />
                        </li>
                    ))}
                </ul>
            )}
            {!isLoggedIn && (
                <Button size="small" onClick={() => showDialog(SignInDialog)}>
                    {t("HeaderNav.labels.signIn")}
                </Button>
            )}
        </>
    );
}

export default HeaderNav;
