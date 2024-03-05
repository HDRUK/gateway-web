"use client";

import * as React from "react";
import { isMobile } from "react-device-detect";
import { useTranslations } from "next-intl";
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
