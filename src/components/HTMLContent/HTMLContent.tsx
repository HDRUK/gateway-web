"use client";

import { Content } from "./HTMLContent.styles";

export interface HTMLContentProps {
    content: string;
}

const HTMLContent = ({ content }: HTMLContentProps) => {
    return (
        <Content
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
                __html: content,
            }}
        />
    );
};

export default HTMLContent;
