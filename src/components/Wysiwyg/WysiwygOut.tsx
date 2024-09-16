import { useMemo } from "react";
import { Typography } from "@mui/material";
import { generateHTML, JSONContent } from "@tiptap/react";
import parse, {
    attributesToProps,
    DOMNode,
    domToReact,
} from "html-react-parser";
import { EXTENSIONS } from "./consts";

interface WysiwygOutProps {
    value: string;
}

export default function WysiwygOut({ value }: WysiwygOutProps) {
    const html = useMemo(() => {
        if (value) {
            return parse(
                generateHTML(JSON.parse(value) as JSONContent, EXTENSIONS),
                {
                    replace: domNode => {
                        if (domNode.type === "tag") {
                            const props = attributesToProps(domNode.attribs);

                            switch (domNode.name) {
                                case "p":
                                    return (
                                        <Typography {...props} sx={{ mb: 2 }}>
                                            {domToReact(
                                                domNode.children as DOMNode[]
                                            )}
                                        </Typography>
                                    );
                                default:
                                    break;
                            }
                        }
                    },
                }
            );
        }
    }, [value]);

    if (!html) return null;

    return html;
}
