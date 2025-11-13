"use client";

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { ThemeProvider } from "@mui/material/styles";
import { useIsHomePage } from "@/hooks/useIsHomePage";
import { sourceSans3 } from "@/config/fonts";
import theme from "@/config/theme";
import NextAppDirEmotionCacheProvider from "./EmotionCache";

export default function ThemeRegistry({
    children,
    isIframe = false,
}: {
    children: React.ReactNode;
    isIframe?: boolean;
}) {
    const isHome = useIsHomePage(isIframe);

    return (
        <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
            <ThemeProvider theme={theme}>
                <GlobalStyles
                    styles={{
                        body: {
                            width: "100%",
                            fontFamily: sourceSans3.style.fontFamily,
                            display: "flex",
                            flexDirection: "column",
                            minHeight: "100vh",
                            ...(isHome
                                ? {
                                      background:
                                          "linear-gradient(97deg, #46AF93 4.05%, #475DA7 100%)",
                                  }
                                : {}),
                        },
                    }}
                />
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                {children}
            </ThemeProvider>
        </NextAppDirEmotionCacheProvider>
    );
}
