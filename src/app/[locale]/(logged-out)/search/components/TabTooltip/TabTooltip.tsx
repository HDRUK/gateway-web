import { ReactNode } from "react";
import { Box } from "@mui/material";
import TooltipIcon from "@/components/TooltipIcon";

interface TabTooltipProps {
    children: ReactNode;
    content: string;
}

const TabTooltip = ({ children, content }: TabTooltipProps) => {
    return (
        <Box sx={{ display: "flex", gap: 1 }}>
            {children}
            <TooltipIcon
                content={content}
                label=""
                buttonSx={{ p: 0 }}
                size="small"
            />
        </Box>
    );
};

export default TabTooltip;
