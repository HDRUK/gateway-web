import { parseStaticImagePaths } from "@/utils/general";

export const StaticImages = {
    LANDING_PAGE: parseStaticImagePaths(
        {
            datasets: "datasets_biosamples.png",
            data_uses: "data_uses_research_projects.png",
            cohort_discovery: "cohort_discovery.png",
            analysis_scripts_software: "analysis_scripts_software.png",
            publications: "publications.png",
            data_custodians: "data_custodians.png",
            data_custodian_network: "data_custodian_networks.png",
            collections: "collections.png",
            phenotypes: "phenotypes.png",
            courses: "courses.png",
            welcome_image: "welcome-image.png",
        },
        "landing_page"
    ),
    BASE: parseStaticImagePaths({
        logo: "heath_data_research_gateway_logo_white.svg",
    }),
};
