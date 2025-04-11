import { ElementType, memo, ReactNode } from "react";
import Tooltip from "@/components/Tooltip";
import ConditionalWrapper from "../ConditionalWrapper";
import Typography from "../Typography";

interface EllipsisLineLimitProps {
    text: string;
    maxLine?: number;
    showToolTip?: boolean;
    component?: ElementType;
}

const tooltipWrapper = (text: string) => (children: ReactNode) => {
    return (
        <Tooltip title={text} placement="bottom">
            <span>{children}</span>
        </Tooltip>
    );
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
