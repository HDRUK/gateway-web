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
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(3, 1fr)",
                    md: "repeat(5, 1fr)",
                },
            }}>
            {navigation}
            <Box
                sx={{
                    gridColumn: { sm: "span 2", md: "span 4" },
                    p: 0,
                    overflow: "hidden",
                }}>
                {body}
            </Box>
        </BoxContainer>
    );
}
