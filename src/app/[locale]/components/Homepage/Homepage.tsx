"use client";

import * as React from "react";
import { isMobile } from "react-device-detect";
import { ArrowForward } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { PageTemplateHome } from "@/interfaces/Cms";
import { SearchCategory } from "@/interfaces/Search";
import Box from "@/components/Box";
import Button from "@/components/Button";
import GradientBoxes from "@/components/GradientBoxes";
import HTMLContent from "@/components/HTMLContent";
import InfoHoverPanelProps from "@/components/InfoHoverPanel";
import LogoSlider from "@/components/LogoSlider";
import TitleWithBg from "@/components/TitleWithBg";
import theme, { colors } from "@/config/theme";
import { TeamContent, TeamImage, TeamWrapper } from "./Homepage.styles";

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
    cmsContent: PageTemplateHome;
}

const HomePage = ({ cmsContent }: HomePageProps) => {
    const t = useTranslations("pages.home");
    const [isTouchDevice, setIsTouchDevice] = React.useState<boolean>(false);

    const {
        meetTheTeam,
        homeFields: { affiliateLink, gatewayVideo, gatewayVideoHeader, logos },
    } = cmsContent.template;

    const logosFormatted = React.useMemo(
        () =>
            logos.map(logo => ({
                websiteUrl: logo.websiteAddress,
                imageSrc: logo.imageLocation.node.mediaItemUrl,
                alt: logo.organisationCharity,
            })),
        [logos]
    );

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
                    title={gatewayVideoHeader}
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
                    <HTMLContent content={gatewayVideo} />
                </Box>
            </Box>
            <Box
                sx={{
                    minHeight: 500,
                    background: `linear-gradient(170deg, ${colors.darkGreen50} 70%, #fff calc(70% + 1px))`,
                }}
                textAlign="center">
                <TitleWithBg
                    size="md"
                    variant="h2"
                    mb={2}
                    title={meetTheTeam.sectionName}
                />
                <TeamWrapper>
                    <TeamImage
                        src={meetTheTeam.image.node.sourceUrl}
                        alt={meetTheTeam.image.node.altText}
                    />

                    <TeamContent>
                        <Typography
                            sx={{
                                fontSize: { mobile: 20, desktop: 28 },
                            }}>
                            {meetTheTeam.title}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: 15,
                            }}>
                            {meetTheTeam.intro}
                        </Typography>
                        <Button
                            variant="text"
                            endIcon={<ArrowForward color="primary" />}>
                            {t("seeNow")}
                        </Button>
                    </TeamContent>
                </TeamWrapper>
            </Box>
            <Box
                sx={{
                    minHeight: 500,
                    background: `linear-gradient(170deg, #fff 70%, ${theme.palette.secondary.main} calc(70% + 1px))`,
                }}
                textAlign="center"
            />
            <Box
                sx={{
                    p: 0,
                    minHeight: 500,
                    background: `linear-gradient(170deg,${theme.palette.secondary.main} 70%,  #fff calc(70% + 1px))`,
                }}
                textAlign="center">
                <Box
                    sx={{
                        display: { tablet: "flex" },
                        background: "white",
                        gap: 2,
                        alignItems: "center",
                    }}>
                    <a
                        href={affiliateLink.url}
                        target="_blank"
                        rel="noreferrer">
                        <Button
                            sx={{
                                minWidth: 200,
                                width: "100%",
                                whiteSpace: {
                                    mobile: "unset",
                                    desktop: "nowrap",
                                },
                            }}
                            color="secondary"
                            variant="outlined">
                            {affiliateLink.title}
                        </Button>
                    </a>
                    <LogoSlider logos={logosFormatted} />
                </Box>
            </Box>
        </>
    );
};

export default HomePage;
