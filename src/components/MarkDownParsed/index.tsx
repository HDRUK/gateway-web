import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";
import Markdown from "markdown-to-jsx";

interface MarkDownParsedProps {
    children: string;
}

const MarkDownParsed = ({ children }: MarkDownParsedProps) => {
    return <Markdown>{DOMPurify.sanitize(parse(children))}</Markdown>;
};
export default MarkDownParsed;
