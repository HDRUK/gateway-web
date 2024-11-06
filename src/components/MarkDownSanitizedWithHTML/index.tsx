import React from "react";
import { SxProps } from "@mui/material/styles";
import DOMPurify from "isomorphic-dompurify";
import Markdown from "markdown-to-jsx";

export interface MarkdownWithHtmlProps {
    content: string;
    WrapperComponent?: React.ElementType | React.ReactNode;
    sx?: SxProps;
    overrideLinks?: boolean;
}

export const MarkDownSanitizedWithHtml = ({
    content,
    sx = {},
    WrapperComponent = "div",
    overrideLinks = true,
}: MarkdownWithHtmlProps) => {
    const sanitizedContent = DOMPurify.sanitize(content);

    const hrefOverride = overrideLinks
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

    const overrides = {
        ...hrefOverride,
    };

    const Wrapper = WrapperComponent as React.ElementType;

    return (
        <Wrapper style={sx}>
            <Markdown
                options={{
                    overrides,
                }}>
                {sanitizedContent}
            </Markdown>
        </Wrapper>
    );
};
