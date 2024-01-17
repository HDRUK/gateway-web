/** @jsxImportSource @emotion/react */
"use client";

import { useState } from "react";
import { hotjar } from "react-hotjar";
import { AppBar, IconButton, Toolbar } from "@mui/material";
import Image from "next/image";
import Link from "@/components/Link";
import AccountNavWrapper from "@/modules/AccountNavWrapper";
import HeaderNav from "@/modules/HeaderNav";
import { MenuIcon } from "@/consts/icons";
import * as styles from "./Header.styles";

const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID;
const HOTJAR_VERSION = 6;

function Header() {
    const [showNavList, setShowNavList] = useState(false);

    const menuClickHandler = () => {
        setShowNavList(prev => !prev);
    };

    if (HOTJAR_ID) {
        hotjar.initialize(parseInt(HOTJAR_ID), HOTJAR_VERSION);
    }

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
                        <Link href="/" css={styles.homeLogo} passHref={false}>
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
