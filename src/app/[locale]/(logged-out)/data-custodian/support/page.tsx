import SupportCentreLinks from "./components/SupportCentreLinks";
import metaData from "@/utils/metdata";

export const metadata = metaData(
    {
        title: "Support - Data Custodians",
        description: ""
    })
const SupportCenterPage = () => {
    return <SupportCentreLinks />;
};

export default SupportCenterPage;
