"use client";

/** @jsxImportSource @emotion/react */
import { useTheme } from "@emotion/react";
import * as styles from "./HTMLContent.styles";

export interface HTMLContentProps {
    content: string;
}

const HTMLContent = ({ content }: HTMLContentProps) => {
    const theme = useTheme();
    return (
        <div
            css={styles.content({ theme })}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
                __html: content,
            }}
        />
    );
};

export default HTMLContent;
