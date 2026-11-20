import { Box } from "@mui/material";
import { SITE_NAME } from "@/consts/application";
import { getHomePage, getSortedNewsEventsByDate } from "@/utils/cms";
import metaData from "@/utils/metadata";
import Homepage from "./components/Homepage";

export const metadata = metaData({ title: SITE_NAME, isDefault: true });

export default async function HomePage() {
    const cmsContent = await getHomePage();

    const sortedPosts = await getSortedNewsEventsByDate(cmsContent.posts.edges);

    return (
        <Box component="main" sx={{ overflowX: "hidden" }}>
            <Homepage
                cmsContent={{
                    ...cmsContent,
                    posts: {
                        edges: sortedPosts,
                    },
                }}
            />
        </Box>
    );
}
