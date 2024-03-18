import * as React from "react";
import Box from "@/components/Box";
import Container from "@/components/Container";
import Header from "@/components/Header";
import { getHomePage } from "@/utils/cms";
import Homepage from "./components/Homepage";

export default async function HomePage() {
    const cmsContent = await getHomePage();
    return (
        <Container
            maxWidth={false}
            disableGutters
            sx={{
                background:
                    "linear-gradient(97deg, #46AF93 4.05%, #475DA7 100%)",
            }}>
            <Header isHome />
            <main>
                <Container
                    sx={{
                        gridTemplateColumns: "repeat(5, 1fr)",
                    }}>
                    <Box sx={{ p: { mobile: 2, desktop: 0 } }}>
                        <Homepage cmsContent={cmsContent} />
                    </Box>
                </Container>
            </main>
        </Container>
    );
}
