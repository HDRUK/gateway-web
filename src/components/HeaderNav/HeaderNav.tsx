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

    if (isLoading) return <Loading />;

    return (
        <>
            <Box
                sx={{
                    flexGrow: 1,
                    justifyContent: "flex-start",
                    display: {
                        tablet: "none",
                        mobile: "none",
                        laptop: "flex",
                    },
                }}>
                <Typography css={styles.navItem}>
                    Explore
                    <ExpandMoreIcon sx={{ fill: "#475DA7" }} />
                </Typography>
                <Typography css={styles.navItem}>
                    Help
                    <ExpandMoreIcon sx={{ fill: "#475DA7" }} />
                </Typography>
                <Typography css={styles.navItem}>
                    Usage data
                    <ExpandMoreIcon sx={{ fill: "#475DA7" }} />
                </Typography>
                <Typography css={styles.navItem}>
                    About us
                    <ExpandMoreIcon sx={{ fill: "#475DA7" }} />
                </Typography>
                {/* news route to be implemented */}
                <Link href="/news" label="News" css={styles.navLink} />
                {/* community route to be implemented */}
                <Link
                    href="/community"
                    label="Community"
                    css={styles.navLink}
                />
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
                <Button
                    css={styles.signInBtn}
                    size="small"
                    onClick={() => showDialog(SignInDialog)}>
                    {t("HeaderNav.labels.signIn")}
                </Button>
            )}
        </>
    );
}

export default HeaderNav;
