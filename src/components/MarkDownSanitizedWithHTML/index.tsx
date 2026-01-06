"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Typography } from "@mui/material";
import { SxProps } from "@mui/material/styles";
import { generateHTML, JSONContent } from "@tiptap/react";
import DOMPurify from "isomorphic-dompurify";
import Markdown from "markdown-to-jsx";
import { convertNumericalCharaterEntities } from "@/utils/string";
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

        const sanitized = convertNumericalCharaterEntities(
            DOMPurify.sanitize(value)
        );

        return sanitized;
    }, [content]);

    useEffect(() => {
        setIsLoaded(true);
    }, [parsedContent]);

    const overrides = {
        ...(overrideLinks && {
            a: {
                component: CustomLink,
            },
        }),
        p: {
            component: Typography,
            props: { sx: { mb: 2 } },
        },
        h2: {
            component: Typography,
            props: {
                variant: "h2",
                sx: { fontWeight: 600 },
            },
        },
        h3: {
            component: Typography,
            props: {
                variant: "h3",
                sx: { fontWeight: 600 },
            },
        },
        h4: {
            component: Typography,
            props: {
                variant: "h4",
                sx: { fontWeight: 600 },
            },
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
