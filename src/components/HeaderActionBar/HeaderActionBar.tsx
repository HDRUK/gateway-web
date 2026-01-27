"use client";

import { ReactNode } from "react";
import { SxProps } from "@mui/material";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import Box from "@/components/Box";
import theme from "@/config/theme";

interface HeaderActionBarProps {
    backButtonHref: string;
    backButtonText: string;
    additionalContent?: ReactNode;
    wrapperSx?: SxProps;
    additionalContentSx?: SxProps;
}

const HeaderActionBar = ({
    additionalContent,
    backButtonHref,
    backButtonText,
    wrapperSx,
    additionalContentSx,
}: HeaderActionBarProps) => {
    const router = useRouter();

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                boxShadow: theme.customShadows.subtle,
                flexDirection: "column",
                gap: 2,

                [theme.breakpoints.up("desktop")]: {
                    flexDirection: "row",
                },

                ...wrapperSx,
            }}>
            <BackButton
                label={backButtonText}
                buttonSx={{
                    m: 0,
                    alignSelf: "flex-start",
                }}
                onClick={() => router.push(backButtonHref)}
            />

            {additionalContent && (
                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        p: 0,
                        alignSelf: "flex-start",
                        ...additionalContentSx,
                    }}>
                    {additionalContent}
                </Box>
            )}
        </Box>
    );
};

export default HeaderActionBar;
