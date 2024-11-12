import { MetadataRoute } from "next";
import sitemapJson from "../seeded/sitemap.json";

const {
    collections,
    dataCustodians,
    dataCustodianNetworks,
    dataSets,
    durs,
    tools,
} = sitemapJson;

export const revalidate = 3600;

const { NEXT_PUBLIC_GATEWAY_URL } = process.env;

const domain = `${NEXT_PUBLIC_GATEWAY_URL}/en`;

const collectionRouteConfig = {
    changeFrequency: "weekly",
    priority: 0.9,
};

const dataCustodiansRouteConfig = {
    changeFrequency: "daily",
    priority: 0.6,
};

const dataCustodianNetworksRouteConfig = {
    changeFrequency: "weekly",
    priority: 0.9,
};

const dursRouteConfig = {
    changeFrequency: "yearly",
    priority: 0.7,
};

const dataSetsRouteConfig = {
    changeFrequency: "weekly",
    priority: 1,
};

const toolRouteConfig = {
    changeFrequency: "monthly",
    priority: 0.7,
};

function updateDynamicSeededDataPages(): MetadataRoute.Sitemap[] {
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
    return [
        ...sitemapJson.static,
        ...updateDynamicSeededDataPages(),
    ] as MetadataRoute.Sitemap[];
}
