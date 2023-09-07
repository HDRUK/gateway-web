import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { ReactNode } from "react";
import { Box, IconButton } from "@mui/material";

import Popover from "@/components/Popover";

interface TableTooltipCellProps {
    header: string;
    content: ReactNode;
}

const TableTooltipCell = ({ header, content }: TableTooltipCellProps) => {
    return (
        <Box display="flex" alignItems="center">
            {header}
            <Popover
                actionType="hover"
                position="top"
                content={content}
                trigger={
                    <IconButton>
                        <QuestionMarkIcon />
                    </IconButton>
                }
            />
        </Box>
    );
};

export default TableTooltipCell;
