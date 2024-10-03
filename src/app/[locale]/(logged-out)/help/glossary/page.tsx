import { notFound } from "next/navigation";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import HTMLContent from "@/components/HTMLContent";
import { getGlossary } from "@/utils/cms";
import "@/styles/wpStyles.css";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Glossary",
    description: "",
};

const GlossaryPage = async () => {
    const cmsPage = await getGlossary();

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

export default GlossaryPage;
