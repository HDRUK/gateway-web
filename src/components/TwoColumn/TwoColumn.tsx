import { ReactNode } from "react";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";

interface TwoColumnProps {
    leftContent: ReactNode;
    rightContent: ReactNode;
}

const TwoColumn = ({ leftContent, rightContent }: TwoColumnProps) => {
    return (
        <BoxContainer
            sx={{
                display: "flex",
                flexGrow: 1,
            }}>
            <Box
                sx={{
                    bgcolor: "white",
                    p: 0,
                }}>
                {leftContent}
            </Box>
            <Box sx={{ flex: 1 }}>{rightContent}</Box>
        </BoxContainer>
    );
};

export default TwoColumn;
