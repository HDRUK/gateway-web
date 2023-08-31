import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import LeftNav from "@/modules/LeftNav";
import { Typography } from "@mui/material";
import Paper from "@/components/Paper";

const TeamDataUsesPage = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My account - Datasets" />
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
                    <LeftNav />
                </Box>
                <Box
                    sx={{ gridColumn: { tablet: "span 3", laptop: "span 4" } }}>
                    <Paper>
                        <Box>
                            <Typography variant="h2">Data uses</Typography>
                        </Box>
                    </Paper>
                </Box>
            </BoxContainer>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await loadServerSideLocales(locale)),
        },
    };
};

export default TeamDataUsesPage;
