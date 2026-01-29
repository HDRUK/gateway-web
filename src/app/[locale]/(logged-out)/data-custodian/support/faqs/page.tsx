import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import metaData from "@/utils/metadata";
import "@/styles/wpStyles.css";
import SupportPage from "../components/SupportPage";

export const metadata = metaData({
    title: "Data Custodians",
    description: "",
});

const FAQsPage = async () => {
    const cmsPage = await getContentPageByParentQuery("DataCustodianFAQs", {
        id: "data-custodian-faqs",
        idType: "URI",
        parentId: "/data-custodian-support",
    });

    console.log(cmsPage);

    if (!cmsPage) {
        notFound();
    }

    return <SupportPage title={cmsPage?.title} content={cmsPage?.content} />;
};

export default FAQsPage;
