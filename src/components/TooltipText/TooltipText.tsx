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
        <Tooltip describeChild tabIndex={0} title={content}>
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
                {label}
            </Typography>
        </Tooltip>
    );
};

export default TooltipText;
