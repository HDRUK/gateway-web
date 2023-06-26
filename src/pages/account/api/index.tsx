import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import { getUserFromToken } from "@/utils/cookies";
import LandingPage from "@/modules/ApiManagement/LandingPage";

const Add = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My account - App Registration" />
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
                    sx={{ gridColumn: { tablet: "span 3", laptop: "span 4" } }}>
                    <LandingPage />
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
            user: getUserFromToken(req.cookies),
            ...(await loadServerSideLocales(locale)),
            isProtected: true,
        },
    };
};

export default Add;
