import { RouteName } from "@/consts/routeName";

const navItems = [
    {
        label: "Search",
        subItems: [
            {
                label: "Cohort Discovery",
                href: "/about/cohort-discovery",
            },
            {
                label: "Phenotypes",
                href: "https://phenotypes.healthdatagateway.org/",
            },
            {
                label: "Courses",
                href: "https://hdruklearn.org/",
            },
            {
                label: "Datasets/BioSamples",
                href: "/search?type=datasets",
            },
            {
                label: "Data Uses",
                href: "/search?type=dur",
            },
            {
                label: "Analysis scripts & software",
                href: "/search?type=tools",
            },
            {
                label: "Publications",
                href: "/search?type=publications",
            },
            {
                label: "Data Custodians",
                href: "/search?type=data_providers",
            },
            {
                label: "Collections / Networks",
                href: "/search?type=collections",
            },
        ],
    },
    {
        label: "Community",
        subItems: [
            {
                label: "The Technology Ecosystem",
                href: "/community/development-community",
            },
            {
                label: "Open-Source Development",
                href: "/community/open-source-development",
            },
        ],
    },
    {
        label: "News",
        subItems: [
            {
                label: "News",
                href: "/news/events?tab=news",
            },
            {
                label: "Events",
                href: "/news/events?tab=events",
            },
            {
                label: "Gateway releases",
                href: "/news/releases",
            },
            {
                label: "Newsletter",
                href: "/newsletter-signup",
            },
        ],
    },
    {
        label: "About",
        subItems: [
            {
                label: "Our mission and purpose",
                href: "/about/our-mission-and-purpose",
            },
            {
                label: "For Researchers and Innovators",
                href: "/about/researchers-innovators",
            },
            {
                label: "For Custodians",
                href: "/about/data-custodians",
            },
            {
                label: "For the Public",
                href: "/about/patients-and-public",
            },
            {
                label: "The Gateway Team",
                href: `/${RouteName.MEET_THE_TEAM}`,
            },
        ],
    },
    {
        label: "Help",
        subItems: [
            {
                label: "Support Centre",
                href: "/support",
            },
            {
                label: "Tutorials",
                href: "/help/tutorials",
            },
            {
                label: "Contact Us",
                href: "https://hdruk.atlassian.net/servicedesk/customer/portal/7",
            },
            {
                label: "Glossary",
                href: "/help/glossary",
            },
        ],
    },
    {
        label: "",
        divider: true,
        href: "",
    },
    {
        label: "Data Custodian Area",
        subItems: [
            {
                label: "How to set yourself up as a Data Custodian",
                href: "/data-custodian/getting-started",
            },
            {
                label: "Integrations",
                href: "https://hdruk.github.io/gateway-2-integrations-testing/integrations-hdruk-datasets/",
            },
            {
                label: "Metadata onboarding",
                href: "/data-custodian/metadata-onboarding",
            },
            {
                label: "The Alliance",
                href: "https://ukhealthdata.org/",
            },
        ],
    },
];

export default navItems;
