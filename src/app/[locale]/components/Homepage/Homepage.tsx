"use client";

import * as React from "react";
import { isMobile } from "react-device-detect";
import { useTranslations } from "next-intl";
import { PageTemplateDefault } from "@/interfaces/Cms";
import { SearchCategory } from "@/interfaces/Search";
import Box from "@/components/Box";
import GradientBoxes from "@/components/GradientBoxes";
import HTMLContent from "@/components/HTMLContent";
import InfoHoverPanelProps from "@/components/InfoHoverPanelProps";
import TitleWithBg from "@/components/TitleWithBg";
import theme, { colors } from "@/config/theme";

const services = [
    {
        id: SearchCategory.DATASETS,
        image: "/images/homepage/welcome-image.png",
        href: `/search?type=${SearchCategory.DATASETS}`,
    },
    {
        id: SearchCategory.DATA_USE,
        image: "/images/homepage/welcome-image.png",
        href: `/search?type=${SearchCategory.DATA_USE}`,
    },
    {
        id: "feasibility",
        image: "/images/homepage/welcome-image.png",
        href: "/about/cohort-discovery",
    },
    {
        id: SearchCategory.DATA_PROVIDERS,
        image: "/images/homepage/welcome-image.png",
        href: `/search?type=${SearchCategory.DATA_PROVIDERS}`,
    },
    {
        id: SearchCategory.COLLECTIONS,
        image: "/images/homepage/welcome-image.png",
        href: `/search?type=${SearchCategory.COLLECTIONS}`,
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
        id: SearchCategory.PUBLICATIONS,
        image: "/images/homepage/welcome-image.png",
        href: `/search?type=${SearchCategory.PUBLICATIONS}`,
    },

    {
        id: SearchCategory.DATA_ANALYSIS,
        image: "/images/homepage/welcome-image.png",
        href: `/search?type=${SearchCategory.DATA_ANALYSIS}`,
    },
    {
        id: "courses",
        image: "/images/homepage/welcome-image.png",
        href: "https://www.hdruk.ac.uk/study-and-train/train/learn-with-hdr-uk-futures/",
    },
];

const items = [
    {
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ",
        text: "Vestibulum ultrices purus sit amet cursus gravida. Proin maximus porttitor dui, sed lobortis libero ultrices vitae. In a sem at erat venenatis rhoncus. Morbi at diam sed risus commodo tempus nec ac ligula. Curabitur arcu velit, volutpat in risus sed, suscipit commodo nulla. Aenean luctus feugiat eros at laoreet. Fusce rhoncus augue nec tellus ultrices, et tempor sapien sollicitudin.",
    },
    {
        title: "Vestibulum ultrices purus sit amet cursus gravida. ",
        text: "Proin maximus porttitor dui, sed lobortis libero ultrices vitae. In a sem at erat venenatis rhoncus. Morbi at diam sed risus commodo tempus nec ac ligula. Curabitur arcu velit, volutpat in risus sed, suscipit commodo nulla. Aenean luctus feugiat eros at laoreet. Fusce rhoncus augue nec tellus ultrices, et tempor sapien sollicitudin.",
    },
    {
        title: "Aenean luctus feugiat eros at laoreet.",
        text: "Fusce rhoncus augue nec tellus ultrices, et tempor sapien sollicitudin.",
    },
];

interface HomePageProps {
    cmsContent: PageTemplateDefault;
}

const HomePage = ({ cmsContent }: HomePageProps) => {
    const t = useTranslations("pages.home");
    const [isTouchDevice, setIsTouchDevice] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (isMobile) {
            setIsTouchDevice(true);
        }
    }, []);

    const responsiveServices = isTouchDevice
        ? services.map(service => ({ ...service, text: t("touchDevice") }))
        : services;

    return (
        <>
            <Box
                sx={{
                    background: `linear-gradient(170deg, transparent 70%, ${colors.darkGreen50} calc(70% + 1px))`,
                }}>
                <InfoHoverPanelProps items={responsiveServices} />
            </Box>
            <Box
                sx={{
                    background: colors.darkGreen50,
                }}>
                <GradientBoxes items={items} maxWidth={420} />
            </Box>
            <Box
                textAlign="center"
                sx={{
                    background: "#fff",
                }}>
                <TitleWithBg
                    size="md"
                    variant="h2"
                    mb={2}
                    title={cmsContent.title}
                />
            </Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    background: `linear-gradient(9deg, ${colors.darkGreen50} 70%, #fff calc(70% + 1px))`,
                }}>
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 950,
                    }}>
                    <HTMLContent content={cmsContent.content} />
                </Box>
            </Box>
            <Box
                sx={{
                    minHeight: 500,
                    background: `linear-gradient(170deg, ${colors.darkGreen50} 70%, #fff calc(70% + 1px))`,
                }}
                textAlign="center"
            />
            <Box
                sx={{
                    minHeight: 500,
                    background: `linear-gradient(170deg, #fff 70%, ${theme.palette.secondary.main} calc(70% + 1px))`,
                }}
                textAlign="center"
            />
            <Box
                sx={{
                    minHeight: 500,
                    background: `linear-gradient(170deg,${theme.palette.secondary.main} 70%,  #fff calc(70% + 1px))`,
                }}
                textAlign="center"
            />
        </>
    );
};

export default HomePage;
