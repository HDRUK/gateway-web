import { notFound } from "next/navigation";
import { getContentPageByParentQuery } from "@/utils/cms";
import metaData from "@/utils/metdata";
import "@/styles/wpStyles.css";
import SupportPage from "../components/SupportPage";

export const metadata = metaData({
    title: "Using the Gateway Enquiry & Data Access Request Module - Data Custodian",
    description: "",
});

const EnquiryDarModulePage = async () => {
    const cmsPage = await getContentPageByParentQuery("EnquiryDarModule", {
        id: "using-the-gateway-enquiry-data-access-request-module",
        idType: "URI",
        parentId: "/data-custodian-support",
    });

    if (!cmsPage) {
        notFound();
    }

    return <SupportPage title={cmsPage?.title} content={cmsPage?.content} />;
};

export default EnquiryDarModulePage;
