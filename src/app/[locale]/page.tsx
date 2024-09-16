import { Box } from "@mui/material";
import Container from "@/components/Container";
import Header from "@/components/Header";
import { getHomePage, getSortedNewsEventsByDate } from "@/utils/cms";
import Homepage from "./components/Homepage";

export default async function HomePage() {
    const cmsContent = await getHomePage();

    const sortedPosts = getSortedNewsEventsByDate(cmsContent.posts.edges);

    return (
        <Container
            maxWidth={false}
            disableGutters
            sx={{
                background:
                    "linear-gradient(97deg, #46AF93 4.05%, #475DA7 100%)",
            }}>
            <Header isHome />
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
        </Container>
    );
}
