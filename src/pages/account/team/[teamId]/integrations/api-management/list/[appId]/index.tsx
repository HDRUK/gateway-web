import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import ApplicationTabs from "@/modules/ApplicationTabs";
import { Typography } from "@mui/material";
import LeftNav from "@/modules/LeftNav";
import Paper from "@/components/Paper";
import BackButton from "@/components/BackButton";

const EditApplication = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My account - Applications" />
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
                    <BackButton label="Back to API selection" />
                    <Paper>
                        <Box>
                            <Typography variant="h2">API Management</Typography>
                            <Typography>
                                Use this page to register your application with
                                us.
                            </Typography>
                        </Box>
                        <ApplicationTabs />
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

export default EditApplication;
