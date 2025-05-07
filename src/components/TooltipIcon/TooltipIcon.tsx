import { ReactNode } from "react";
import { Box, IconButton, SxProps } from "@mui/material";
import Tooltip from "@/components/Tooltip";
import theme, { colors } from "@/config/theme";
import { InfoIcon } from "@/consts/icons";

const TOOLTIP_WIDTH = "395px";

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
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={boxSx}>
            {label}
            <Tooltip
                title={content}
                slotProps={{
                    tooltip: {
                        sx: {
                            borderRadius: 0,
                            background: colors.grey900,
                            color: colors.white,
                            padding: 2,
                            maxWidth: TOOLTIP_WIDTH,
                            margin: 0,
                            fontSize: theme.typography.body1,
                        },
                    },
                }}>
                <IconButton sx={{ ...buttonSx }}>
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
