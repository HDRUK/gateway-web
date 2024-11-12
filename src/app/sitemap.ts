import * as fs from "fs";
import { MetadataRoute } from "next";
import * as fs from 'fs';
import * as path from 'path';
import sitemapJson from "../seeded/sitemap.json";

interface SiteMapResponse {
    id: number;
    updated_at: string;
}

interface SiteMapJson {
    collections: SiteMapResponse[];
    dataCustodians: SiteMapResponse[];
    dataCustodianNetworks: SiteMapResponse[];
    dataSets: SiteMapResponse[];
    durs: SiteMapResponse[];
    tools: SiteMapResponse[];
}

const {
    collections,
    dataCustodians,
    dataCustodianNetworks,
    dataSets,
    durs,
    tools,
} = sitemapJson as SiteMapJson;

export const revalidate = 3600;

const { NEXT_PUBLIC_GATEWAY_URL } = process.env;

const domain = `${NEXT_PUBLIC_GATEWAY_URL}/en`;

const staticRoutesConfig = {
    changeFrequency: "monthly",
    priority: 0.8,
};
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

const startingDir = "./src/app/[locale]/(logged-out)";
const fileName = "page";
const ext = ".tsx";
const exclusions = ["search", "sign-in"];

async function findUrlInFiles(
    dir: string = startingDir
): Promise<MetadataRoute.Sitemap[]> {
    let results: MetadataRoute.Sitemap[] = [];

    const items = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
            const subDirResults = await findUrlInFiles(fullPath);
            results = results.concat(subDirResults);
        } else {
            const fullFileName = fileName + ext;
            if (item.name === fullFileName && path.extname(item.name) === ext) {
                const url = fullPath
                    .replace("src/app/[locale]/(logged-out)", domain)
                    .replace("/page.tsx", "");

                if (
                    url.includes("[") ||
                    url.includes("(") ||
                    exclusions.includes(item.name.replace("/page.tsx", ""))
                ) {
                    console.log("dynamic route avoided for:", fullPath);
                } else {
                    results.push({
                        url,
                        ...staticRoutesConfig,
                    });
                }
            }
        }
    }

    return results;
}

async function staticPages(): Promise<MetadataRoute.Sitemap[]> {
    return [
        {
            url: domain,
            changeFrequency: "Monthly",
            priority: 1,
        },
        ...(await findUrlInFiles()),
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap[]> {
    return [...(await staticPages()), ...seededDataPages()];
}
