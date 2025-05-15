import { ReactNode } from "react";
import { Box, Tooltip } from "@mui/material";

interface TabTooltipProps {
    children: ReactNode;
    content: string;
}

const TabTooltip = ({ children, content }: TabTooltipProps) => {
    return (
        <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip
                title={content}
                // content={content}
                buttonSx={{ p: 0 }}
                size="small">
                {children}
            </Tooltip>
        </Box>
    );
};

export default TabTooltip;
