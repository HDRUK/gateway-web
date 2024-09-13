import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { parseEncodedJSON, slateJsonToHtml } from "@/utils/json";

interface WysiwygOutProps {
    value: string;
}

export default function WysiwygOut({ value }: WysiwygOutProps) {
    const [html, setHTML] = useState("");

    useEffect(() => {
        setHTML(slateJsonToHtml(parseEncodedJSON(value)));
    }, [value]);

    return (
        <div
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(html),
            }}
        />
    );
}
