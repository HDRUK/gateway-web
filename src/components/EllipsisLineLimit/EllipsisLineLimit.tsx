import LinesEllipsis from "react-lines-ellipsis";
import responsiveHOC from "react-lines-ellipsis/lib/responsiveHOC";

interface EllipsisLineLimitProps {
    text: string;
    maxLine?: number;
}

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

const EllipsisLineLimit = ({ text, maxLine = 2 }: EllipsisLineLimitProps) => {
    return (
        <ResponsiveEllipsis
            text={text}
            maxLine={maxLine}
            ellipsis="..."
            trimRight
            basedOn="letters"
        />
    );
};

export default EllipsisLineLimit;
