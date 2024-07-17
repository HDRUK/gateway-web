import Banner from "@/components/Banner";
import Container from "@/components/Container";
import HTMLContent from "@/components/HTMLContent";
import { getDataCustodians } from "@/utils/cms";
import "@/styles/wpStyles.css";

export const metadata = {
  title: "Health Data Research Innovation Gateway - Data Custodians",
  description: "",
};

const DataCustodiansPage = async () => {
  const cmsPage = await getDataCustodians();

  return (
    <>
      <Banner title={cmsPage.title} />
      <Container sx={{ padding: 10 }} className="wpStyles">
        {cmsPage?.content && <HTMLContent content={cmsPage?.content} />}
      </Container>
    </>
  );
};

export default DataCustodiansPage;
