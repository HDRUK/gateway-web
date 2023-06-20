/** @jsxImportSource @emotion/react */
import { useTheme } from "@emotion/react";
import * as styles from "./WPContent.styles";

export interface WPContentProps {
    content: string;
}

const WPContent = ({ content }: WPContentProps) => {
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

export default WPContent;
