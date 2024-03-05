import { ReactNode, useState } from "react";
import LinesEllipsis from "react-lines-ellipsis";
import responsiveHOC from "react-lines-ellipsis/lib/responsiveHOC";
import ConditionalWrapper from "../ConditionalWrapper";
import Tooltip from "../Tooltip";

interface EllipsisLineLimitProps {
    text: string;
    maxLine?: number;
    showToolTip?: boolean;
}

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

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
}: EllipsisLineLimitProps) => {
    const [isClamped, setIsClamped] = useState(false);

    const handleReflow = (rleState: { clamped: boolean }) => {
        const { clamped } = rleState;
        setIsClamped(clamped);
    };

    return (
        <ConditionalWrapper
            requiresWrapper={isClamped && showToolTip}
            wrapper={tooltipWrapper(text)}>
            <ResponsiveEllipsis
                text={text}
                maxLine={maxLine}
                ellipsis="..."
                trimRight
                basedOn="letters"
                onReflow={handleReflow}
            />
        </ConditionalWrapper>
    );
};

export default EllipsisLineLimit;
