import { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

export interface PageBannerProps {
    children: ReactNode;
    backgroundImageUrl: string;
}

export default function PageBanner({
    children,
    backgroundImageUrl,
}: PageBannerProps) {
    return (
        <Box
            sx={{
                width: "calc(100% + 7px)",
                height: "200px",
                overflow: "hidden",
                marginLeft: "-7px",
                position: "relative",
                backgroundImage: `url("${backgroundImageUrl}")`,
                backgroundRepeat: "no-repeat",
            }}>
            <Typography
                sx={{
                    position: "absolute",
                    bottom: "42px",
                    left: "42px",
                    color: "white",
                    fontSize: "40px",
                    lineHeight: "0",
                    fontWeight: "600",
                }}>
                {children}
            </Typography>
        </Box>
    );
}
