import React from "react";
import { Typography } from "@mui/material";
import { SxProps } from "@mui/material/styles";
import { generateHTML } from "@tiptap/html";
import { JSONContent } from "@tiptap/react";
import DOMPurify from "isomorphic-dompurify";
import Markdown from "markdown-to-jsx";
import { EXTENSIONS } from "../Wysiwyg/consts";

export interface MarkdownWithHtmlProps {
    content: string;
    wrapper?: React.ElementType | React.ReactNode;
    sx?: SxProps;
    overrideLinks?: boolean;
}

const hrefOverride = (overrideLinks: boolean) => {
    return overrideLinks
        ? {
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
          }
        : null;
};

const rawOrHtml = (content: string) => {
    let value;
    try {
        const html = JSON.parse(content) as JSONContent;
        value = generateHTML(html, EXTENSIONS);
    } catch (_e) {
        value = content;
    }
    return value;
};

export const MarkDownSanitizedWithHtml = ({
    content,
    sx = {},
    wrapper = "div",
    overrideLinks = true,
}: MarkdownWithHtmlProps) => {
    const sanitizedContent = DOMPurify.sanitize(content);

    const overrides = {
        ...hrefOverride(overrideLinks),
        p: <Typography sx={{ mb: 2 }} />,
    };

    const Wrapper = wrapper as React.ElementType;

    return (
        <Wrapper style={sx}>
            <Markdown
                options={{
                    overrides,
                }}>
                {rawOrHtml(sanitizedContent)}
            </Markdown>
        </Wrapper>
    );
};
