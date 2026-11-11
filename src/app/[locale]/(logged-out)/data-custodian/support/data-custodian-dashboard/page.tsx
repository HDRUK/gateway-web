import { notFound } from "next/navigation";
import { getDataCustodianDashboard } from "@/utils/cms";
import metaData from "@/utils/metadata";
import "@/styles/wpStyles.css";
import SupportPage from "../components/SupportPage";

export const metadata = metaData({
    title: "Data Custodian Dashboard - Data Custodians",
    description: "",
});

const DataCustodianDashboardPage = async () => {
    const cmsPage = await getDataCustodianDashboard();

    if (!cmsPage) {
        notFound();
    }

    return <SupportPage title={cmsPage?.title} content={cmsPage?.content} />;
};

export default DataCustodianDashboardPage;
