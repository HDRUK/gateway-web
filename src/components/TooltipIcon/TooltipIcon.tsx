import { ReactNode, useId } from "react";
import { Box, IconButton, SxProps, Tooltip } from "@mui/material";
import { InfoIcon } from "@/consts/icons";

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
    icon,
    size = "medium",
    boxSx,
    buttonSx,
    invertColor,
}: TooltipIconProps) => {
    const id = useId();

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={boxSx}>
            <span id={id}>{label}</span>
            <Tooltip title={content}>
                <IconButton
                    sx={{ ...buttonSx }}
                    disableRipple
                    aria-labelledby={id}>
                    {icon || (
                        <InfoIcon
                            color={!invertColor ? "primary" : "inherit"}
                            sx={{ color: `${invertColor && "#E9ECF4"}` }}
                            fontSize={size}
                        />
                    )}
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default TooltipIcon;
