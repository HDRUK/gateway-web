import { ElementType, memo, ReactNode } from "react";
import { Tooltip } from "@mui/material";
import ConditionalWrapper from "../ConditionalWrapper";
import Typography from "../Typography";

interface EllipsisLineLimitProps {
    text: string;
    maxLine?: number;
    showToolTip?: boolean;
    component?: ElementType;
}

const tooltipWrapper = (text: string) => {
    const TooltipWrapper = (children: ReactNode) => (
        <Tooltip title={text} placement="bottom" describeChild>
            <span>{children}</span>
        </Tooltip>
    );
    return TooltipWrapper;
};

const EllipsisLineLimit = ({
    text,
    maxLine = 2,
    showToolTip = false,
    component = "p",
}: EllipsisLineLimitProps) => {
    return (
        <ConditionalWrapper
            requiresWrapper={showToolTip}
            wrapper={tooltipWrapper(text)}>
            <Typography
                component={component}
                sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: maxLine,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: "inherit",
                    fontWeight: "inherit",
                }}>
                {text}
            </Typography>
        </ConditionalWrapper>
    );
};

export default memo(EllipsisLineLimit);
