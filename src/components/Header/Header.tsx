/** @jsxImportSource @emotion/react */

import Link from "@/components/Link";
import Image from "next/image";
import { AppBar, IconButton, Toolbar } from "@mui/material";
import HeaderNav from "@/modules/HeaderNav";
import AccountNavWrapper from "@/modules/AccountNavWrapper";
import { useState } from "react";
import { MenuIcon } from "@/consts/icons";
import * as styles from "./Header.styles";

function Header() {
    const [showNavList, setShowNavList] = useState(false);

    const menuClickHandler = () => {
        setShowNavList(prev => !prev);
    };
    return (
        <AppBar position="static" css={styles.appbar}>
            <Toolbar css={styles.toolbar}>
                <div css={styles.menuWrapper}>
                    <div css={styles.logoIconBox}>
                        <IconButton
                            disableRipple
                            size="large"
                            edge="start"
                            aria-label="open drawer"
                            css={styles.menuIcon}
                            onClick={menuClickHandler}>
                            <MenuIcon color="primary" />
                        </IconButton>
                        <Link href="/" css={styles.homeLogo}>
                            <Image
                                src="/images/logos/gateway-main.svg"
                                priority
                                width={110}
                                height={50}
                                alt="Gateway home logo"
                            />
                        </Link>
                    </div>

                    <HeaderNav showNavList={showNavList} />
                </div>
                <AccountNavWrapper />
            </Toolbar>
        </AppBar>
    );
}

export default Header;
