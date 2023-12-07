import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import { ReactNode } from "react";

interface TwoColumnProps {
    leftContent: ReactNode;
    rightContent: ReactNode;
}

const TwoColumn = ({ leftContent, rightContent }: TwoColumnProps) => {
    return (
        <BoxContainer
            sx={{
                gridTemplateColumns: {
                    mobile: "repeat(1, 1fr)",
                    tablet: "repeat(5, 1fr)",
                },
                gap: {
                    mobile: 0,
                    tablet: 1,
                },
            }}>
            <Box
                sx={{
                    gridColumn: { tablet: "span 2", laptop: "span 1" },
                    bgcolor: "white",
                }}>
                {leftContent}
            </Box>
            <Box sx={{ gridColumn: { tablet: "span 3", laptop: "span 4" } }}>
                {rightContent}
            </Box>
        </BoxContainer>
    );
};

export default TwoColumn;
