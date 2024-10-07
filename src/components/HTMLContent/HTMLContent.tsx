"use client";

import DOMPurify from "isomorphic-dompurify";
import { Content } from "./HTMLContent.styles";

export interface HTMLContentProps {
    content: string;
}

const HTMLContent = ({ content }: HTMLContentProps) => {
    return (
        <Content
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(content),
            }}
        />
    );
};

export default HTMLContent;
