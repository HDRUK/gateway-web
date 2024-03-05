"use client";

import * as React from "react";
import { isMobile } from "react-device-detect";
import { useTranslations } from "next-intl";
import { SearchCategory } from "@/interfaces/Search";
import InfoHoverPanelProps from "@/components/InfoHoverPanelProps";

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

export default function HomePage() {
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

    return <InfoHoverPanelProps items={responsiveServices} />;
}
