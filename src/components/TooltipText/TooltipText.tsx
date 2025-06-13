import { ReactNode } from "react";
import { SxProps, Tooltip, Typography } from "@mui/material";

interface TooltipTextProps {
    label?: ReactNode;
    content: ReactNode;
    size?: "medium" | "small" | "inherit" | "large";
    sx?: SxProps;
}

const TooltipText = ({
    label,
    content,
    size = "medium",
    sx,
    ...restProps
}: TooltipTextProps) => {
    return (
        <Typography
            data-testid="tooltipText"
            sx={{
                fontSize: size,
                fontWeight: 600,
                textDecoration: "underline",
                textDecorationStyle: "dashed",
                textDecorationThickness: "1px",
                textUnderlineOffset: 5,
                ...sx,
            }}
            {...restProps}>
            <Tooltip
                describeChild
                placement="right"
                tabIndex={0}
                title={content}>
                {label}
            </Tooltip>
        </Typography>
    );
};

export default TooltipText;
