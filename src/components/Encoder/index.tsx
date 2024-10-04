import DOMPurify from "isomorphic-dompurify";

interface EncoderProps {
    raw: string;
    component?: React.FunctionComponent;
}

const Encoder = ({ raw, component }: EncoderProps) => {
    const Component = component || "div";
    return (
        <Component
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(raw),
            }}
        />
    );
};
export default Encoder;
