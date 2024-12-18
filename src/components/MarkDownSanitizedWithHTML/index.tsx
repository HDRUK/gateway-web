"use client";

import React, { useMemo, useState } from "react";
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

const CustomLink = ({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
    </a>
);

export const MarkDownSanitizedWithHtml = ({
    content,
    sx = {},
    wrapper = "div",
    overrideLinks = true,
}: MarkdownWithHtmlProps) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const parsedContent = useMemo(() => {
        let value = content;
        try {
            const html = JSON.parse(content) as JSONContent;
            value = generateHTML(html, EXTENSIONS);
        } catch (_e) {
            // If parsing fails, fallback to raw content
        }

        const sanitized = DOMPurify.sanitize(value);
        setIsLoaded(true);
        return sanitized;
    }, [content]);

    const overrides = {
        ...(overrideLinks && {
            a: {
                component: CustomLink,
            },
        }),
        p: <Typography sx={{ mb: 2 }} />,
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
