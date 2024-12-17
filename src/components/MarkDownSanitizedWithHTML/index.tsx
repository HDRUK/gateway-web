"use client";

import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { SxProps } from "@mui/material/styles";
import { generateHTML, JSONContent } from "@tiptap/react";
import DOMPurify from "isomorphic-dompurify";
import Markdown from "markdown-to-jsx";
import { EXTENSIONS } from "../Wysiwyg/consts";

export interface MarkdownWithHtmlProps {
    content: string;
    wrapper?: React.ElementType | React.ReactNode;
    sx?: SxProps;
    overrideLinks?: boolean;
}

export const MarkDownSanitizedWithHtml = ({
    content,
    sx = {},
    wrapper = "div",
    overrideLinks = true,
}: MarkdownWithHtmlProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [parsedContent, setParsedContent] = useState<string>("");

    useEffect(() => {
        let value = content;

        try {
            const html = JSON.parse(content) as JSONContent;
            value = generateHTML(html, EXTENSIONS);
        } catch (_e) {
            // If parsing fails, fallback to raw content
        }

        const sanitized = DOMPurify.sanitize(value);
        setParsedContent(sanitized);
        setIsLoaded(true);
    }, [content]);

    const overrides = {
        ...(overrideLinks && {
            a: {
                component: ({
                    href,
                    children,
                }: {
                    href: string;
                    children: React.ReactNode;
                }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer">
                        {children}
                    </a>
                ),
            },
        }),
        p: {
            component: (props: any) => <Typography sx={{ mb: 2 }} {...props} />,
        },
    };

    const Wrapper = wrapper as React.ElementType;

    const styles = {
        ...sx,
        ...(isLoaded ? {} : { display: "none" }),
    };

    return (
        <Wrapper style={styles}>
            <Markdown options={{ overrides }}>{parsedContent}</Markdown>
        </Wrapper>
    );
};
