import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import ApplicationTabs from "@/modules/ApplicationTabs";
import { Typography } from "@mui/material";
import LeftNav from "@/modules/LeftNav";

const Application = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My account - Applications" />
            <BoxContainer
                sx={{
                    // display: "flex",
                    // justifyContent: "flex-start",
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
                    sx={{ gridColumn: { tablet: "span 2", laptop: "span 1" } }}>
                    <LeftNav />
                </Box>
                <Box
                    sx={{ gridColumn: { tablet: "span 3", laptop: "span 4" } }}>
                    <h2 style={{ marginBottom: "10px" }}>
                        Application Management
                    </h2>
                    <Typography>
                        Use this page to register your application with us.
                    </Typography>
                    <ApplicationTabs />
                </Box>
            </BoxContainer>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({
    req,
    locale,
}) => {
    return {
        props: {
            ...(await loadServerSideLocales(locale)),
        },
    };
};

export default Application;
