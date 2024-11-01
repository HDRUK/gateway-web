import { notFound } from "next/navigation";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import HTMLContent from "@/components/HTMLContent";
import { getTechnologyEcosystem } from "@/utils/cms";
import "@/styles/wpStyles.css";
import metaData from "@/utils/metdata";

export const metadata = metaData(
    {
        title: "The Technology Ecosystem",
        description: ""
    })
const DevelopmentCommunityPage = async () => {
    const cmsPage = await getTechnologyEcosystem();

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

export default DevelopmentCommunityPage;
