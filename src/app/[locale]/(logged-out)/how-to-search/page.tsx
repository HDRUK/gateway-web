import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import HTMLContent from "@/components/HTMLContent";
import { getHowToSearchPage } from "@/utils/cms";
import "@/styles/wpStyles.css";
import metaData from "@/utils/metdata";
export const metadata = metaData(
    {
        title: "How to search the Gateway",
        description: ""
    })
const HowToSearchPage = async () => {
    const cmsPage = await getHowToSearchPage();

    if (!cmsPage) {
        notFound();
    }

    return (
        <>
            <Banner title={cmsPage?.title} />
            <Container sx={{ padding: 10 }} className="wpStyles">
                <BackButton label="Back to search" />
                {cmsPage?.content && <HTMLContent content={cmsPage?.content} />}
            </Container>
        </>
    );
};

export default HowToSearchPage;
