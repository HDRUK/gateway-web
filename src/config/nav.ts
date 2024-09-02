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
                label: "Technology ecosystem",
                href: "https://www.hdruk.ac.uk/research/research-data-infrastructure/technology-ecosystem/",
            },
            {
                label: "Gateway development community",
                href: "/community/gateway-development-community",
            },
            {
                label: "Our principles for development",
                href: "https://www.hdruk.ac.uk/about-us/policies/development-principles/",
            },
            {
                label: "Technical commitment",
                href: "https://www.hdruk.ac.uk/study-and-train/about-the-training-team/vision-and-strategy/the-technician-commitment/",
            },
            {
                label: "DARE UK",
                href: "https://dareuk.org.uk/",
            },
        ],
    },
    {
        label: "News",
        subItems: [
            {
                label: "Gateway releases",
                href: "/news/releases",
            },
            {
                label: "Events",
                href: "/news/events",
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
                label: "Terms and conditions",
                href: "/terms-and-conditions",
            },
            {
                label: "For Researchers and Innovators",
                href: "/about/researchers-innovators",
            },
            {
                label: "For the Development Community",
                href: "/about/development-community",
            },
            {
                label: "For Data Custodians",
                href: "/about/data-custodians",
            },
            {
                label: "For Patients and Public",
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
                label: "Glossary",
                href: "/help/glossary",
            },
            {
                label: "Support Centre",
                href: "/help/support-centre",
            },
            {
                label: "Tutorials",
                href: "/help/tutorials",
            },
            {
                label: "Contact Us",
                href: "/help/contact-us",
            },
        ],
    },
    {
        label: "",
        divider: true,
        href: "",
    },
    // TODO: Verticle line here
    {
        label: "Data Custodian Area",
        subItems: [
            {
                label: "Getting started on the Gateway",
                href: "/data/getting-started",
            },
            {
                label: "Integrations",
                href: "https://hdruk.github.io/gateway-2-integrations-testing/",
            },
            {
                label: "Metadata onboarding",
                href: "https://hdruk.github.io/gateway-2-integrations-testing/creating-metadata/",
            },
            {
                label: "The Alliance",
                href: "https://ukhealthdata.org/",
            },
        ],
    },
];

export default navItems;
