"use client";

import DOMPurify from "dompurify";
import theme from "@/config/theme";
import Box from "../Box";

export interface HTMLContentProps {
    content: string;
}

const HTMLContent = ({ content }: HTMLContentProps) => {
    return (
        <Box
            sx={{
                p: 0,
                h5: {
                    fontSize: 18,
                },
                a: {
                    color: theme.palette.secondary.main,
                    ":hover": {
                        textDecoration: "none",
                    },
                },
            }}
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(content, {
                    ADD_TAGS: ["iframe"],
                    ADD_ATTR: [
                        "allow",
                        "allowfullscreen",
                        "frameborder",
                        "scrolling",
                    ],
                }),
            }}
        />
    );
};

export default HTMLContent;
