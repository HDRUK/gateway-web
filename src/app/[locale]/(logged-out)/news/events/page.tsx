import Banner from "@/components/Banner";
import Container from "@/components/Container";
import Tabs from "@/components/Tabs";
import { getEvents, getNews, getSortedNewsEventsByDate } from "@/utils/cms";
import Content from "./components/Content";

export const metadata = {
    title: "Health Data Research Innovation Gateway - News - Events",
    description: "",
};

const NewsEventsPage = async () => {
    const newsData = await getNews();
    const eventsData = await getEvents();

    let sortedNews = null;
    let sortedEvents = null;

    if (newsData) {
        sortedNews = getSortedNewsEventsByDate(newsData);
    }

    if (eventsData) {
        sortedEvents = getSortedNewsEventsByDate(eventsData);
    }

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
                            content: <Content data={sortedNews || []} />,
                        },
                        {
                            value: "events",
                            label: "Events",
                            content: <Content data={sortedEvents || []} />,
                        },
                    ]}
                />
            </Container>
        </>
    );
};

export default NewsEventsPage;
