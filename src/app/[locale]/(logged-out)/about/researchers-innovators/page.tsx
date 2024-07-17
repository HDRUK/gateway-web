import Banner from "@/components/Banner";
import Container from "@/components/Container";
import HTMLContent from "@/components/HTMLContent";
import { getDevelopmentCommunity, getResearchersInnovators } from "@/utils/cms";
import "@/styles/wpStyles.css";

export const metadata = {
  title: "Health Data Research Innovation Gateway - Researchers/Innovators",
  description: "",
};

const ResearchersInnovatorsPage = async () => {
  const cmsPage = await getResearchersInnovators();

  return (
    <>
      <Banner title={cmsPage.title} />
      <Container sx={{ padding: 10 }} className="wpStyles">
        {cmsPage?.content && <HTMLContent content={cmsPage?.content} />}
      </Container>
    </>
  );
};

export default ResearchersInnovatorsPage;
