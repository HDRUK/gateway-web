import { ReactNode, useState } from "react";
import { Box, IconButton } from "@mui/material";
import Popover from "@mui/material/Popover";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface TableTooltipCellProps {
    header: string;
    content: ReactNode;
}

const TableTooltipCell = ({ header, content }: TableTooltipCellProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    return (
        <Box display="flex" alignItems="center">
            {header}
            <IconButton
                disableRipple
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}>
                <HelpOutlineIcon color="primary" fontSize="medium" />
            </IconButton>
            <Popover
                id="table-tooltip-cell"
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

export default TableTooltipCell;
