import { ReactNode, useState } from "react";
import { Box, IconButton } from "@mui/material";
import Popover from "@mui/material/Popover";
import { HelpOutlineIcon } from "@/consts/icons";
import { colors } from "@/config/theme";

interface TooltipIconProps {
    label: ReactNode;
    content: ReactNode;
}

const TooltipIcon = ({ label, content }: TooltipIconProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    return (
        <Box display="flex" alignItems="center" justifyContent="space-between">
            {label}
            <IconButton
                disableRipple
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}>
                <HelpOutlineIcon color="primary" fontSize="medium" />
            </IconButton>
            <Popover
                id="tooltip"
                sx={{
                    pointerEvents: "none",
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                transformOrigin={{
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
