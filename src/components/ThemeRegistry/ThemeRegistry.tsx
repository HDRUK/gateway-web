"use client";

import * as React from "react";
import { GlobalStyles } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import { sourceSans3 } from "@/config/fonts";
import theme from "@/config/theme";
import NextAppDirEmotionCacheProvider from "./EmotionCache";

export default function ThemeRegistry({
    children,
}: {
    children: React.ReactNode;
}) {
    const isHome = usePathname() === "/en";
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
