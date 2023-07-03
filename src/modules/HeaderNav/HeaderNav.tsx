/** @jsxImportSource @emotion/react */

import Link from "@/components/Link";
import { Box, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import * as styles from "./HeaderNav.styles";
import AccountNavWrapper from "../AccountNavWrapper";

function HeaderNav() {
    const navItems = ["Explore", "Help", "Usage data", "About us"];
    const navLinks = [
        { label: "Releases", href: "/about/releases" },
        { label: "News", href: "/news" },
        { label: "Community", href: "/community" },
        { label: "Applications", href: "/account/application" },
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

            <AccountNavWrapper />
        </>
    );
}

export default HeaderNav;
