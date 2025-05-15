import { ReactNode } from "react";
import { Box, SxProps, Tooltip, Typography } from "@mui/material";

interface TooltipIconProps {
    label?: ReactNode;
    content: ReactNode;
    icon?: ReactNode;
    size?: "medium" | "small" | "inherit" | "large";
    boxSx?: SxProps;
    buttonSx?: SxProps;
    invertColor?: boolean;
}

const TooltipIcon = ({
    label,
    content,
    size = "medium",
    boxSx,
}: TooltipIconProps) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={boxSx}>
            <Tooltip title={content}>
                <Typography
                    sx={{
                        fontSize: size,
                        fontWeight: 600,
                        textDecoration: "underline",
                        textDecorationStyle: "dashed",
                    }}>
                    {label || "p"}
                </Typography>
            </Tooltip>
        </Box>
    );
};

export default TooltipIcon;
