import { ReactNode } from "react";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import metaData, { noFollowRobots } from "@/utils/metadata";

export const metadata = metaData(
    {
        title: "Dataset",
        description: "",
    },
    noFollowRobots
);

export interface LayoutDataItemProps {
    navigation: ReactNode;
    body: ReactNode;
}

export default function LayoutDataItemPage({
    navigation,
    body,
}: LayoutDataItemProps) {
    return (
        <BoxContainer
            sx={{
                gridTemplateColumns: {
                    mobile: "repeat(1, 1fr)",
                    tablet: "repeat(5, 1fr)",
                },
            }}>
            <Box
                sx={{
                    gridColumn: { tablet: "span 2", laptop: "span 1" },
                    bgcolor: "white",
                    p: 0,
                }}>
                {navigation}
            </Box>
            <Box
                sx={{
                    gridColumn: { tablet: "span 3", laptop: "span 4" },
                    p: 0,
                }}>
                {body}
            </Box>
        </BoxContainer>
    );
}
