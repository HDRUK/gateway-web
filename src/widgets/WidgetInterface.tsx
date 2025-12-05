"use client";

/* eslint-disable @next/next/no-page-custom-font */
import { GlobalStyles, ThemeProvider } from "@mui/material";
import { WidgetEntityData } from "@/interfaces/Widget";
import theme from "@/config/theme";
import WidgetDisplay from "./WidgetDisplay";

type WidgetDisplayProps = { data: WidgetEntityData };

export default function WidgetInterface({ data }: WidgetDisplayProps) {
    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600&display=swap&subset=latin"
                rel="stylesheet"
            />
            <ThemeProvider theme={theme}>
                <GlobalStyles
                    styles={{
                        body: {
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            minHeight: "100vh",
                        },
                    }}
                />
                <WidgetDisplay data={data} />
            </ThemeProvider>
        </>
    );
}
