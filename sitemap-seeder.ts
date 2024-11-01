import fs from 'fs'

import dotenv from 'dotenv'

dotenv.config({ path: '.env' })


const apiVersion = process.env.NEXT_PUBLIC_API_VERSION ?? "v1";
const apiV1Url = `${process.env.NEXT_PUBLIC_API_V1_URL}/${apiVersion}`;
const getSiteMapData:() => Promise<void> = async () => {
   await fetch(`${apiV1Url}/sitemap`).then(async (res) => {
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

   });
}

getSiteMapData()

