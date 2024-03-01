import { useState } from "react";
import LinesEllipsis from "react-lines-ellipsis";
import responsiveHOC from "react-lines-ellipsis/lib/responsiveHOC";
import Tooltip from "../Tooltip";

interface EllipsisLineLimitProps {
    text: string;
    maxLine?: number;
    showToolTip?: boolean;
}

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

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

    if (isClamped && showToolTip) {
        return (
            <Tooltip title={text} placement="bottom">
                <ResponsiveEllipsis
                    text={text}
                    maxLine={maxLine}
                    ellipsis="..."
                    trimRight
                    basedOn="letters"
                    onReflow={handleReflow}
                />
            </Tooltip>
        );
    }
    return (
        <ResponsiveEllipsis
            text={text}
            maxLine={maxLine}
            ellipsis="..."
            trimRight
            basedOn="letters"
            onReflow={handleReflow}
        />
    );
};

export default EllipsisLineLimit;
