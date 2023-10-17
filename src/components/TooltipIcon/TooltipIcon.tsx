import { ReactNode, useState } from "react";
import { Box, IconButton } from "@mui/material";
import Popover from "@mui/material/Popover";
import { HelpOutlineIcon } from "@/consts/icons";

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
                {content}
            </Popover>
        </Box>
    );
};

export default TooltipIcon;
