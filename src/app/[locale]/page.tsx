import { Box } from "@mui/material";
import { getHomePage, getSortedNewsEventsByDate } from "@/utils/cms";
import Homepage from "./components/Homepage";

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
