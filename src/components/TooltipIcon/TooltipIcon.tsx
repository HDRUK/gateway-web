import { ReactNode, useState } from "react";
import { Box, IconButton, SxProps } from "@mui/material";
import Popover from "@mui/material/Popover";
import { colors } from "@/config/theme";
import { InfoIcon } from "@/consts/customIcons";

interface TooltipIconProps {
    label: ReactNode;
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
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={boxSx}>
            {label}
            <IconButton
                disableRipple
                sx={{ ...buttonSx }}
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}>
                {icon || (
                    <InfoIcon
                        color={!invertColor ? "primary" : "inherit"}
                        sx={{
                            color: `${invertColor && "#E9ECF4"}`,
                        }}
                        fontSize={size}
                        data-testid="InfoIcon"
                    />
                )}
            </IconButton>
            <Popover
                id="tooltip"
                sx={{
                    pointerEvents: "none",
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus>
                <Box
                    sx={{
                        color: "white",
                        background: colors.grey900,
                        padding: "15px",
                        maxWidth: "395px",
                        margin: 0,
                    }}>
                    {content}
                </Box>
            </Popover>
        </Box>
    );
};

export default TooltipIcon;
