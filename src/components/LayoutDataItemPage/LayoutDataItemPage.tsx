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
                    tablet: "repeat(3, 1fr)",
                    laptop: "repeat(5, 1fr)",
                },
            }}>
            {navigation}
            <Box
                sx={{
                    gridColumn: { tablet: "span 2", laptop: "span 4" },
                    p: 0,
                    overflow: "hidden",
                }}>
                {body}
            </Box>
        </BoxContainer>
    );
}
