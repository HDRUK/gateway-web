/** @jsxImportSource @emotion/react */
import { ReactNode } from "react";
import { SxProps } from "@mui/material";
import Box from "@/components/Box";
import * as styles from "./ScrollContent.styles";

export interface ScrollContentProps {
    children: ReactNode;
    sx?: SxProps;
}

const ScrollContent = ({ children, ...rest }: ScrollContentProps) => {
    return (
        <Box sx={{ height: 300, p: 0 }} css={styles.root} {...rest}>
            {children}
        </Box>
    );
};

export default ScrollContent;
