import Head from "@/components/Head";
import type { GetServerSideProps } from "next";
import { loadServerSideLocales } from "@/utils/locale";
import Box from "@/components/Box";
import Container from "@/components/Container";
import BoxContainer from "@/components/BoxContainer";

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
                <BoxContainer sx={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                    <Box sx={{ bgcolor: "background.default" }}>
                        <h3>Container 1</h3>
                    </Box>
                    <Box sx={{ bgcolor: "background.default" }}>
                        <h3>Container 2</h3>
                    </Box>
                    <Box sx={{ bgcolor: "background.default" }}>
                        <h3>Container 3</h3>
                    </Box>
                </BoxContainer>
                <Box sx={{ p: 5 }}>
                    <h2>More content here</h2>
                    <p>
                        Join the thousands of researchers and scientists
                        worldwide who are already using the Gateway for research
                        and scientific discovery.
                    </p>
                </Box>
                <BoxContainer sx={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                    <Box sx={{ bgcolor: "background.default" }}>
                        <h3>Container 1</h3>
                    </Box>
                    <Box sx={{ bgcolor: "background.default" }}>
                        <h3>Container 2</h3>
                    </Box>
                </BoxContainer>
            </Container>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await loadServerSideLocales(locale)),
        },
    };
};
