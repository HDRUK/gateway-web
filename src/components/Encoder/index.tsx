import DOMPurify from "isomorphic-dompurify";

interface EncoderProps {
    raw: string;
}

const Encoder = ({ raw }: EncoderProps) => (
    <div
        dangerouslySetInnerHTML={{
            __html: DOMPurify(raw),
        }}
    />
);

export default Encoder;
