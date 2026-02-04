import { SearchCategory } from "@/interfaces/Search";
import { RouteName } from "@/consts/routeName";

const navItems = [
    {
        label: "Search",
        subItems: [
            {
                label: "Datasets & BioSamples",
                href: `/search?type=${SearchCategory.DATASETS}`,
            },
            {
                label: "Data Uses / Research Projects",
                href: `/search?type=${SearchCategory.DATA_USE}`,
            },
            {
                label: "Cohort Discovery",
                href: "/about/cohort-discovery",
            },
            {
                label: "Analysis Scripts & Software",
                href: `/search?type=${SearchCategory.TOOLS}`,
            },
            {
                label: "Publications",
                href: `/search?type=${SearchCategory.PUBLICATIONS}`,
            },
            {
                label: "Data Custodians",
                href: `/search?type=${SearchCategory.DATA_CUSTODIANS}`,
            },
            {
                label: "Data Custodian Networks",
                href: `/search?type=${SearchCategory.COLLECTIONS}`,
            },
            {
                label: "Collections",
                href: `/search?type=${SearchCategory.COLLECTIONS}`,
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
