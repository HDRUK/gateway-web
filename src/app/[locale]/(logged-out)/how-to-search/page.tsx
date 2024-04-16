import Container from "@/components/Container";
import HTMLContent from "@/components/HTMLContent";
import Banner from "@/modules/Banner";
import { getHowToSearchPage } from "@/utils/cms";
import "@/styles/wpStyles.css";

export const metadata = {
    title: "Health Data Research Innovation Gateway - How to search the Gateway",
    description: "",
};

const HowToSearchPage = async () => {
    const cmsPage = await getHowToSearchPage();

    return (
        <>
            <Banner
                title={cmsPage.title}
                // src="/images/banners/release-notes.png"
            />
            <Container sx={{ padding: 10 }} className="wpStyles">
                {cmsPage?.content && <HTMLContent content={cmsPage?.content} />}
            </Container>
        </>
    );
};

export default HowToSearchPage;
