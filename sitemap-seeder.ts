import fs from 'fs'

const {NODE_ENV} = process.env
const endpoint = 'sitemap'

let address

if (NODE_ENV === 'development') {
    // during the loading of docker in tilt, it can't seem to talk to gateway-api so for locally just call dev
    address = 'https://api.dev.hdruk.cloud/api/v1/'+endpoint
}

const { NEXT_PUBLIC_API_VERSION, NEXT_PUBLIC_API_V1_URL} = process.env
const version = NEXT_PUBLIC_API_VERSION ?? 'v1'

const siteMapAPI = address ?? `${NEXT_PUBLIC_API_V1_URL}/${version}/${endpoint}`;


const getSiteMapData:() => Promise<void> = async () => {

    try {
        await fetch(siteMapAPI).then(async (res) => {
            if (!res.ok) {
                throw new Error("Failed to fetch data for sitemap");
            }
            console.log('Data okay for sitemap')
            fs.writeFile(
                'src/seeded/sitemap.json',
                JSON.stringify(await res.json()),
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

getSiteMapData()

