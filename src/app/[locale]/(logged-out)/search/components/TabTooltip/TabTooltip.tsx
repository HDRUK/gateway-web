import { ReactNode } from "react";
import { Tooltip } from "@mui/material";

interface TabTooltipProps {
    children: ReactNode;
    content: string;
}

const TabTooltip = ({ children, content }: TabTooltipProps) => {
    return (
        <Tooltip describeChild title={content} size="small">
            {children}
        </Tooltip>
    );
};

export default TabTooltip;
