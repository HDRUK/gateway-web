import { Box } from "@mui/material";
import Container from "@/components/Container";
import Header from "@/components/Header";
import { getHomePage, getSortedNewsEventsByDate } from "@/utils/cms";
import Homepage from "./components/Homepage";

export default async function HomePage() {
    const cmsContent = await getHomePage();

    const sortedPosts = getSortedNewsEventsByDate(cmsContent.posts.edges);

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
