import Banner from "@/components/Banner";
import Container from "@/components/Container";
import Tabs from "@/components/Tabs";
import { getEvents, getNews } from "@/utils/cms";
import Content from "./components/Content";

export const metadata = {
    title: "Health Data Research Innovation Gateway - About - News and Events",
    description: "",
};

const ReleasesPage = async () => {
    const newsData = await getNews();
    const eventsData = await getEvents();

    return (
        <>
            <Banner
                title="News and Events"
                src="/images/banners/release-notes.png"
            />
            <Container sx={{ background: "white", padding: 0 }}>
                <Tabs
                    centered
                    tabs={[
                        {
                            value: "news",
                            label: "News",
                            content: <Content data={newsData} />,
                        },
                        {
                            value: "events",
                            label: "Events",
                            content: <Content data={eventsData} />,
                        },
                    ]}
                />
            </Container>
        </>
    );
};

export default ReleasesPage;
