"use client";

import { ReactNode } from "react";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { colors } from "@/config/theme";

const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
            xxl: 2560,
        },
    },
    typography: {
        allVariants: {
            color: colors.green100,
        },
        h1: {
            textShadow: "2px 2px 3px rgba(33,33,33,.5)",
            color: colors.white,
            fontSize: "2.5rem",
            marginBottom: "1em",
            textAlign: "center",
        },
        h2: {
            marginBottom: "1em",
            fontSize: "1.5em",
        },
        body1: {
            color: colors.white,
        },
    },
    palette: {
        primary: {
            main: colors.purple100,
        },
        secondary: {
            main: colors.green100,
        },
    },
});
export default function ThemeRegistryTester({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles
                styles={{
                    body: {
                        margin: 0,
                        width: "100%",
                        height: "100%",
                    },
                    main: {
                        height: "calc(100% - 155px)",
                        overflowX: "auto",
                    },
                    ".main-para": {
                        height: "calc(100% - 155px)!important",
                    },
                    a: {
                        color: colors.green100,
                    },
                    ".arrow": {
                        position: "absolute",
                        top: "75%",
                        left: "50%",
                        transform: ["translate(-50%, -50%)", "rotate(-90deg)"],
                    },
                    ".arrow span": {
                        display: "block",
                        width: "3vw",
                        height: "3vw",
                        borderBottom: "5px solid white",
                        borderRight: "5px solid white",
                        transform: "rotate(45deg)",
                        margin: "-10px",
                        animation: "animate 2s infinite",
                    },
                    ".arrow span:nth-child(2)": { animationDelay: "-0.2s" },
                    ".arrow span:nth-child(3)": { animationDelay: "-0.4s" },
                    "@keyframes animate": {
                        "0%": {
                            opacity: 0,
                            transform: "rotate(45deg) translate(-20px, -20px)",
                        },
                        "50%": { opacity: 1 },
                        "100%": {
                            opacity: 0,
                            transform: "rotate(45deg) translate(20px, 20px)",
                        },
                    },
                }}
            />
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}
