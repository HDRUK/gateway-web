import BoxContainer from "@/components/BoxContainer";
import Box from "@/components/Box";

export const metadata = {
    title: "Health Data Research Innovation Gateway - My Account",
    description: "",
};

function AccountHome() {
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
                }}
            />
            <Box
                sx={{
                    gridColumn: { tablet: "span 3", laptop: "span 4" },
                }}>
                <h2>My account</h2>
            </Box>
        </BoxContainer>
    );
}

export default AccountHome;
