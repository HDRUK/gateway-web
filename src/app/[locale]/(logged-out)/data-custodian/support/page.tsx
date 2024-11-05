import metaData from "@/utils/metadata";
import SupportCentreLinks from "./components/SupportCentreLinks";

export const metadata = metaData({
    title: "Support - Data Custodians",
    description: "",
});
const SupportCenterPage = () => {
    return <SupportCentreLinks />;
};

export default SupportCenterPage;
