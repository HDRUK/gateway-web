import { ReactNode } from "react";
import { Box, SxProps, Tooltip, Typography } from "@mui/material";

interface TooltipTextProps {
    label?: ReactNode;
    content: ReactNode;
    size?: "medium" | "small" | "inherit" | "large";
    boxSx?: SxProps;
}

const TooltipText = ({
    label,
    content,
    size = "medium",
    boxSx,
}: TooltipTextProps) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={boxSx}>
            <Tooltip title={content}>
                <Typography
                    data-testid="tooltipText"
                    sx={{
                        fontSize: size,
                        fontWeight: 600,
                        textDecoration: "underline",
                        textDecorationStyle: "dashed",
                        textDecorationThickness: "1px",
                        textUnderlineOffset: 5,
                    }}>
                    {label}
                </Typography>
            </Tooltip>
        </Box>
    );
};

export default TooltipText;
