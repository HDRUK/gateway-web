import { notFound } from "next/navigation";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import HTMLContent from "@/components/HTMLContent";
import { getPatientsAndPublic } from "@/utils/cms";
import "@/styles/wpStyles.css";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Patients and Public",
    description: "",
};

const DevelopmentCommunityPage = async () => {
    const cmsPage = await getPatientsAndPublic();

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
