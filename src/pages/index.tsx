import Head from "@/components/Head";
import type { GetServerSideProps } from "next";
import { loadServerSideLocales } from "@/utils/locale";
import Box from "@/components/Box";
import Container from "@/components/Container";
import { getUserFromToken } from "@/utils/cookies";

export default function Home() {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway" />
            <Container
                sx={{
                    gridTemplateColumns: "repeat(5, 1fr)",
                }}>
                <Box sx={{ p: 5 }}>
                    <h1>Gateway to health data and tools for research</h1>
                    <p>
                        Search, discover and request access to hundreds of
                        datasets, tools and resources for your research. Join
                        the thousands of researchers and scientists worldwide
                        who are already using the Gateway for research and
                        scientific discovery.
                    </p>
                </Box>
            </Container>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({
    req,
    locale,
}) => {
    return {
        props: {
            user: getUserFromToken(req.cookies),
            ...(await loadServerSideLocales(locale)),
        },
    };
};
