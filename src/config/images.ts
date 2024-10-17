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
    TEAM_INTEGRATIONS_API_MANAGEMENT: parseStaticImagePaths({
        createPrivateApp:
            "team_integrations_api_management/create_private_app.png",
        managePrivateApps:
            "team_integrations_api_management/manage_private_apps.png",
    }),
    TEAM_INTEGRATIONS_INTEGRATION: parseStaticImagePaths({
        createNewIntegration:
            "team_integrations_integration/create_new_integration.png",
        manageIntegrations:
            "team_integrations_integration/manage_integrations.png",
    }),
    BASE: parseStaticImagePaths({
        logo: "heath_data_research_gateway_logo_white.svg",
        placeholder: "default_placeholder.png",
    }),
};
