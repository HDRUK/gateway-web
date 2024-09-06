"use client";

import { useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { PageTemplateHome } from "@/interfaces/Cms";
import { SearchCategory } from "@/interfaces/Search";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Container from "@/components/Container";
import GradientBoxes from "@/components/GradientBoxes";
import HTMLContent from "@/components/HTMLContent";
import InfoHoverPanel from "@/components/InfoHoverPanel";
import LogoSlider from "@/components/LogoSlider";
import TitleWithBg from "@/components/TitleWithBg";
import theme, { colors } from "@/config/theme";
import { ArrowForward } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import { IFrameWrapper } from "@/styles/IFrameContainer.styles";
import NewsSection from "../NewsSection";
import NewsletterSignup from "../NewsletterSignup";
import { TeamContent, TeamImage, TeamWrapper } from "./Homepage.styles";

const services = [
    {
        id: "feasibility",
        image: "/images/homepage/banner-cohort-discovery.png",
        href: "/about/cohort-discovery",
    },
    {
        id: "phenotypes",
        image: "/images/homepage/banner-phenotypes.png",
        href: "https://phenotypes.healthdatagateway.org/",
    },
    {
        id: "courses",
        image: "/images/homepage/banner-courses.jpg",
        href: "https://hdruklearn.org/",
    },
    {
        id: SearchCategory.DATASETS,
        image: "/images/homepage/banner-datasets.png",
        href: `/search?type=${SearchCategory.DATASETS}`,
    },
    {
        id: SearchCategory.DATA_USE,
        image: "/images/homepage/banner-data-uses.jpg",
        href: `/search?type=${SearchCategory.DATA_USE}`,
    },
    {
        id: SearchCategory.TOOLS,
        image: "/images/homepage/banner-tools.jpg",
        href: `/search?type=${SearchCategory.TOOLS}`,
    },
    {
        id: SearchCategory.PUBLICATIONS,
        image: "/images/homepage/banner-publications.jpg",
        href: `/search?type=${SearchCategory.PUBLICATIONS}`,
    },
    {
        id: "dataProviders",
        image: "/images/homepage/banner-custodians.png",
        href: `/search?type=${SearchCategory.DATA_PROVIDERS}`,
    },
    {
        id: "dataCustodianNetworks",
        image: "/images/homepage/banner-data-custodian-network.png",
        href: `/search?type=${SearchCategory.COLLECTIONS}`,
    },
    {
        id: SearchCategory.COLLECTIONS,
        image: "/images/homepage/banner-collections.jpg",
        href: `/search?type=${SearchCategory.COLLECTIONS}`,
    },

    // {
    //     id: "diseaseAtlas",
    //     image: "/images/homepage/welcome-image.jpg",
    //     href: "https://www.hdruk.ac.uk/research/research-data-infrastructure/disease-atlas/",
    // },
];

interface HomePageProps {
    cmsContent: PageTemplateHome;
}

const HomePage = ({ cmsContent: { page, posts } }: HomePageProps) => {
    const t = useTranslations("pages.home");
    const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

    const {
        meetTheTeam,
        homeFields: {
            affiliateLink,
            gatewayVideo,
            gatewayVideoHeader,
            logos,
            newsHeader,
            newsletterSignupHeader,
            newsletterSignupDescription,
        },
    } = page.template;

    const logosFormatted = useMemo(
        () =>
            logos.map(logo => ({
                websiteUrl: logo.websiteAddress,
                imageSrc: logo.imageLocation.node.mediaItemUrl,
                alt: logo.organisationCharity,
            })),
        [logos]
    );

    useEffect(() => {
        if (isMobile) {
            setIsTouchDevice(true);
        }
    }, []);

    const responsiveServices = isTouchDevice
        ? services.map(service => ({ ...service, text: t("touchDevice") }))
        : services;

    const items = [
        {
            title: t("helpLinks.item1.title"),
            text: t("helpLinks.item1.text"),
            href: RouteName.SUPPORT,
            externalUrl: false,
        },
        {
            title: t("helpLinks.item2.title"),
            text: t("helpLinks.item2.text"),
            href: "https://www.hdruk.ac.uk/",
            externalUrl: true,
        },
    ];

    return (
        <>
            <Box
                sx={{
                    background: `linear-gradient(170deg, transparent 70%, ${colors.darkGreen50} calc(70% + 1px))`,
                }}>
                <Container>
                    <InfoHoverPanel
                        items={responsiveServices}
                        defaultImageSrc="/images/homepage/welcome-image.jpg"
                    />
                </Container>
            </Box>
            <Box
                sx={{
                    background: colors.darkGreen50,
                }}>
                <Container>
                    <GradientBoxes items={items} maxWidth={420} />
                </Container>
            </Box>
            <Box
                sx={{
                    background: "#fff",
                }}>
                <Container sx={{ textAlign: "center" }}>
                    <TitleWithBg
                        size="md"
                        variant="h2"
                        mb={2}
                        title={gatewayVideoHeader}
                    />
                </Container>
            </Box>
            <Box
                sx={{
                    background: `linear-gradient(9deg, ${colors.darkGreen50} 60%, #fff calc(60% + 1px))`,
                }}>
                <Container
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                    }}>
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 950,
                        }}>
                        <IFrameWrapper>
                            <HTMLContent content={gatewayVideo} />
                        </IFrameWrapper>
                    </Box>
                </Container>
            </Box>
            <Box
                sx={{
                    background: colors.darkGreen50,
                }}
                textAlign="center">
                <Container>
                    <Box sx={{ position: "relative", mb: 2 }}>
                        <TitleWithBg
                            size="md"
                            variant="h2"
                            title={newsHeader}
                        />
                        <Box
                            sx={{
                                position: "absolute",
                                right: 0,
                                top: "50%",
                                transform: "translateY(-50%)",
                                [theme.breakpoints.down("tablet")]: {
                                    position: "static",
                                    transform: "none",
                                },
                            }}>
                            <Link
                                href={RouteName.NEWS_EVENTS}
                                color="primary"
                                passHref>
                                <Button
                                    variant="text"
                                    endIcon={
                                        <ArrowForwardIosIcon color="primary" />
                                    }>
                                    {t("newsEvents.seeAllLink")}
                                </Button>
                            </Link>
                        </Box>
                    </Box>
                    <NewsSection posts={posts} />
                </Container>
            </Box>
            <Box
                sx={{
                    background: `linear-gradient(170deg, ${colors.darkGreen50} 50%, #fff calc(50% + 1px))`,
                }}
                textAlign="center">
                <Container>
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
                            <Link
                                href={RouteName.MEET_THE_TEAM}
                                color="primary"
                                passHref>
                                <Button
                                    variant="text"
                                    endIcon={<ArrowForward color="primary" />}>
                                    {t("seeNow")}
                                </Button>
                            </Link>
                        </TeamContent>
                    </TeamWrapper>
                </Container>
            </Box>
            <NewsletterSignup
                title={newsletterSignupHeader}
                description={newsletterSignupDescription}
            />
            <Box
                sx={{
                    background: "white",
                    position: "relative",
                    zIndex: 1,
                    [theme.breakpoints.up(810)]: {
                        marginTop: "-70px",
                    },
                }}>
                <Container
                    sx={{
                        display: { tablet: "flex" },
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
                </Container>
            </Box>
            <Box
                sx={{
                    display: "none",
                    [theme.breakpoints.up(810)]: {
                        position: "relative",
                        zIndex: 0,
                        height: "65px",
                        width: "100%",
                        backgroundColor: "#fff",
                        display: "block",
                    },
                }}
            />
        </>
    );
};

export default HomePage;
