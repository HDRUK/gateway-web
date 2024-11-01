import { notFound } from "next/navigation";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import HTMLContent from "@/components/HTMLContent";
import { getResearchersInnovators } from "@/utils/cms";
import metaData from "@/utils/metdata";
import "@/styles/wpStyles.css";

export const metadata = metaData({
    title: "Researchers/Innovators",
    description: "",
});

const ResearchersInnovatorsPage = async () => {
    const cmsPage = await getResearchersInnovators();

    if (!cmsPage) {
        notFound();
    }

    return (
        <>
            <Banner title={cmsPage?.title} />
            <Container sx={{ padding: 10 }} className="wpStyles">
                {cmsPage?.content && <HTMLContent content={cmsPage?.content} />}
            </Container>
        </>
    );
};

export default ResearchersInnovatorsPage;
