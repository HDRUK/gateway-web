import { MetadataRoute } from "next";
import {
    collections,
    dataCustodians,
    dataCustodianNetworks,
    dataSets,
    durs,
    tools,
} from "../seeded/sitemap.json";

export const revalidate = 3600;

const { NEXT_PUBLIC_GATEWAY_URL } = process.env;

const domain = `${NEXT_PUBLIC_GATEWAY_URL}/en`;

const staticRoutesConfig = {
    changeFrequency: "Monthly",
    priority: 0.8,
};
const collectionRouteConfig = {
    changeFrequency: "Weekly",
    priority: 0.9,
};

const dataCustodiansRouteConfig = {
    changeFrequency: "Daily",
    priority: 0.6,
};

const dataCustodianNetworksRouteConfig = {
    changeFrequency: "Weekly",
    priority: 0.9,
};

const dursRouteConfig = {
    changeFrequency: "Yearly",
    priority: 0.7,
};

const dataSetsRouteConfig = {
    changeFrequency: "Weekly",
    priority: 1,
};

const toolRouteConfig = {
    changeFrequency: "Monthly",
    priority: 0.7,
};
function staticPages(): MetadataRoute.Sitemap[] {
    return [
        {
            url: domain,
            changeFrequency: "Monthly",
            priority: 1,
        },
        {
            url: `${domain}/how-to-search`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/newsletter-signup`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/terms-and-conditions`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/about/cookie-notice`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/about/privacy-policy`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/about/cohort-discovery`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/community/open-source-development`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/community/technology-ecosystem`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/news/events?tab=news`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/news/events?tab=events`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/news/releases`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/about/our-mission-and-purpose`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/about/researchers-innovators`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/about/data-custodians`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/about/meet-the-team`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/support`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/help/glossary`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/data-custodian/support`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/data-custodian/support/getting-started`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/data-custodian/support/metadata-onboarding`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/data-custodian/support/uploading-data-uses-projects`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/data-custodian/support/cohort-discovery`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/data-custodian/support/publications`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/data-custodian/support/managing`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/data-custodian/support/enquiry-dar-module`,
            ...staticRoutesConfig,
        },
        {
            url: `${domain}/data-custodian/support/the-alliance`,
            ...staticRoutesConfig,
        },
    ];
}

function seededDataPages(): MetadataRoute.Sitemap[] {
    const collectionPages: MetadataRoute.Sitemap[] = [];
    collections.forEach(data => {
        collectionPages.push({
            url: `${domain}/collection/${data.id.toString()}`,
            lastModified: data.updated_at,
            ...collectionRouteConfig,
        });
    });

    const dataCustodiansPages: MetadataRoute.Sitemap[] = [];
    dataCustodians.forEach(data => {
        dataCustodiansPages.push({
            url: `${domain}/data-custodian/${data.id.toString()}`,
            lastModified: data.updated_at,
            ...dataCustodiansRouteConfig,
        });
    });

    const dataCustodianNetworksPages: MetadataRoute.Sitemap[] = [];
    dataCustodianNetworks.forEach(data => {
        dataCustodianNetworksPages.push({
            url: `${domain}/data-custodian-network/${data.id.toString()}`,
            lastModified: data.updated_at,
            ...dataCustodianNetworksRouteConfig,
        });
    });

    const dursPages: MetadataRoute.Sitemap[] = [];
    durs.forEach(data => {
        dursPages.push({
            url: `${domain}/data-use/${data.id.toString()}`,
            lastModified: data.updated_at,
            ...dursRouteConfig,
        });
    });

    const dataSetsPages: MetadataRoute.Sitemap[] = [];
    dataSets.forEach(data => {
        dataSetsPages.push({
            url: `${domain}/dataset/${data.id.toString()}`,
            lastModified: data.updated_at,
            ...dataSetsRouteConfig,
        });
    });

    const toolPages: MetadataRoute.Sitemap[] = [];
    tools.forEach(data => {
        toolPages.push({
            url: `${domain}/dataset/${data.id.toString()}`,
            lastModified: data.updated_at,
            ...toolRouteConfig,
        });
    });

    return [
        ...collectionPages,
        ...dataCustodiansPages,
        ...dataCustodianNetworksPages,
        ...dursPages,
        ...dataSetsPages,
        ...toolPages,
    ];
}

export default function sitemap(): MetadataRoute.Sitemap[] {
    return [...staticPages(), ...seededDataPages()];
}
