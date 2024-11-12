import fs from 'fs'
import { MetadataRoute } from "next";
import path from "path";
const {NODE_ENV} = process.env
const endpoint = 'sitemap'

let address
let domain
const locale ='en'

if (NODE_ENV === 'development') {
    // during the loading of docker in tilt, it can't seem to talk to gateway-api so for locally just call dev
    address = 'https://api.dev.hdruk.cloud/api/v1/' + endpoint
    domain = `https://dev.hdruk.cloud/${locale}`
}

const { NEXT_PUBLIC_API_VERSION, NEXT_PUBLIC_API_V1_URL, NEXT_PUBLIC_GATEWAY_URL} = process.env
const version = NEXT_PUBLIC_API_VERSION ?? 'v1'
domain = domain ??`${NEXT_PUBLIC_GATEWAY_URL}/${locale}`

const siteMapAPI = address ?? `${NEXT_PUBLIC_API_V1_URL}/${version}/${endpoint}`;

const startingDir = "./src/app/[locale]/(logged-out)";
const fileName = "page";
const ext = ".tsx";
const exclusions = ["search", "sign-in"];
const staticRoutesConfig = {
    changeFrequency: "monthly",
    priority: 0.8,
};

const getSiteMapData:() => Promise<void> = async () => {

    try {
        await fetch(siteMapAPI).then(async (res) => {
            if (!res.ok) {
                throw new Error("Failed to fetch data for sitemap");
            }
            console.log('Data okay for sitemap')
            const staticData = await findUrlInFiles()
            const sitemapData = {
            ...await res.json(),
            static: [
                {
                    url: domain,
                    changeFrequency: "Monthly",
                    priority: 1,
                },
                ...staticData
            ]
            }
            fs.writeFile(
                'src/seeded/sitemap.json',
                JSON.stringify(sitemapData),
                (err) => {
                    if (err) {
                        console.log('Error writing file:', err)
                    } else {
                        console.log('Successfully seeded sitemap data')
                    }
                }
            )
     
        })
    }
  catch(err) {
    console.log(`failed to call ${siteMapAPI}:`, err)
   };
}


const findUrlInFiles: () => Promise<MetadataRoute.Sitemap[]> = async(
    dir: string = startingDir
) => {
    const items = await fs.promises.readdir(dir, { withFileTypes: true });

    const promises = items.map(async item => {
        const fullPath = path.join(dir, item.name);

        if (item.isDirectory()) {
            return findUrlInFiles(fullPath);
        }
        const fullFileName = fileName + ext;
        if (item.name === fullFileName && path.extname(item.name) === ext) {
            const url = fullPath
                .replace("src/app/[locale]/(logged-out)", domain)
                .replace("/page.tsx", "");

            if (
                url.includes("[") ||
                url.includes("(") ||
                exclusions.includes(
                    fullPath
                        .replace("src/app/[locale]/(logged-out)", "")
                        .replace("/page.tsx", "")
                        .replace("/", "")
                )
            ) {
                console.log("dynamic route avoided for:", fullPath);
                return [];
            }
            return [
                {
                    url,
                    ...staticRoutesConfig,
                },
            ];
        }

        return [];
    });

    const resolvedResults = await Promise.all(promises);

    return resolvedResults.flat() as MetadataRoute.Sitemap[];
}

getSiteMapData()

