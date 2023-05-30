/** @jsxImportSource @emotion/react */

import Link from "@/components/Link";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, IconButton, Toolbar } from "@mui/material";
import HeaderNav from "../HeaderNav/HeaderNav";
import * as styles from "./Header.styles";

function Header() {
    return (
        <AppBar position="static" color="transparent" css={styles.appbar}>
            <Toolbar css={styles.toolbar}>
                <Link
                    href="/"
                    label={
                        <Image
                            src="/images/logos/gateway_main.svg"
                            width={110}
                            height={50}
                            alt="Gateway home logo"
                        />
                    }
                    css={styles.homeLogo}
                />
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    css={styles.menuIcon}>
                    <MenuIcon />
                </IconButton>
                <HeaderNav />
            </Toolbar>
        </AppBar>
    );
}

export default Header;
