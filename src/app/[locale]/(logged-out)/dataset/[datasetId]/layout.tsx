import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";

export default async function DatasetItemLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
                }}
            />
            <Box
                sx={{
                    gridColumn: { tablet: "span 3", laptop: "span 4" },
                    p: 0,
                }}>
                <main>{children}</main>
            </Box>
        </BoxContainer>
    );
}
