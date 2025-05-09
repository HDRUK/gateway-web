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
                label: "Datasets & BioSamples",
                href: "/search?type=datasets",
            },
            {
                label: "Data Uses / Research Projects",
                href: "/search?type=dur",
            },
            {
                label: "Analysis Scripts & Software",
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
                href: "/community/technology-ecosystem",
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
                label: "Release Note Summaries",
                href: "/news/releases",
            },
            {
                label: "Detailed Release Notes",
                href: "https://github.com/HDRUK/gateway-api/blob/dev/change-log-locations.md",
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
                label: "Our Mission and Purpose",
                href: RouteName.MISSION_AND_PURPOSE,
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
                label: "The Technology Team",
                href: RouteName.MEET_THE_TEAM,
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
        href: RouteName.DATA_CUSTODIAN_SUPPORT,
    },
];

export default navItems;
