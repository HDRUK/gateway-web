import { Box } from "@mui/material";
import { getHomePage, getSortedNewsEventsByDate } from "@/utils/cms";
import { logger } from "@/utils/logger";
import Homepage from "./components/Homepage";

export default async function HomePage() {
    const cmsContent = await getHomePage();

    const sortedPosts = getSortedNewsEventsByDate(cmsContent.posts.edges);
    logger.info({ message: "tester" }, "421412421", "home");
    console.log("<<<<<<<<hello");
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
