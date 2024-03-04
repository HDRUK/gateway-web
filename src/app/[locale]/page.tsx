import * as React from "react";
import Box from "@/components/Box";
import Container from "@/components/Container";
import Header from "@/components/Header";
import InfoHoverPanelProps from "@/components/InfoHoverPanelProps";

const services = [
    {
        id: "datasets",
        image: "/images/homepage/welcome-image.png",
        href: "/search?type=datasets",
    },
    {
        id: "dur",
        image: "/images/homepage/welcome-image.png",
        href: "/search?type=dur",
    },
    {
        id: "feasibility",
        image: "/images/homepage/welcome-image.png",
        href: "/about/cohort-discovery",
    },
    {
        id: "dataProviders",
        image: "/images/homepage/welcome-image.png",
        href: "/search?type=dataProvider",
    },
    {
        id: "collections",
        image: "/images/homepage/welcome-image.png",
        href: "/search?type=collections",
    },
    {
        id: "phenotypes",
        image: "/images/homepage/welcome-image.png",
        href: "https://phenotypes.healthdatagateway.org/",
    },
    {
        id: "diseaseAtlas",
        image: "/images/homepage/welcome-image.png",
        href: "https://www.hdruk.ac.uk/research/research-data-infrastructure/disease-atlas/",
    },
    {
        id: "publications",
        image: "/images/homepage/welcome-image.png",
        href: "/search?type=publications",
    },

    {
        id: "dataAnalysis",
        image: "/images/homepage/welcome-image.png",
        href: "/search?type=tools",
    },
    {
        id: "courses",
        image: "/images/homepage/welcome-image.png",
        href: "https://www.hdruk.ac.uk/study-and-train/train/learn-with-hdr-uk-futures/",
    },
];

export default function HomePage() {
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
                    <Box sx={{ p: { mobile: 2, desktop: 5 } }}>
                        <InfoHoverPanelProps items={services} />
                    </Box>
                </Container>
            </main>
        </Container>
    );
}
