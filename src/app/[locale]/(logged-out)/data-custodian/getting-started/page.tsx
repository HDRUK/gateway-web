import Banner from "@/components/Banner";
import Container from "@/components/Container";
import HTMLContent from "@/components/HTMLContent";
import { getGettingStarted } from "@/utils/cms";
import "@/styles/wpStyles.css";

export const metadata = {
  title: "Health Data Research Innovation Gateway - Glossary",
  description: "",
};

const GettingStartedPage = async () => {
  const cmsPage = await getGettingStarted();

  return (
    <>
      <Banner title={cmsPage.title} />
      <Container sx={{ padding: 10 }} className="wpStyles">
        {cmsPage?.content && <HTMLContent content={cmsPage?.content} />}
      </Container>
    </>
  );
};

export default GettingStartedPage;
