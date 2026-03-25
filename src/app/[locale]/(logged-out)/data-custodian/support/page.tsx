import metaData from "@/utils/metadata";
import SupportCentreLinks from "./components/SupportCentreLinks";

export const metadata = metaData({
    title: "Support - Data Custodians",
    description: "",
});
const { NEXT_PUBLIC_CONFLUENCE_URL } = process.env;

const SupportCenterPage = () => {
    return <SupportCentreLinks confluenceUrl={NEXT_PUBLIC_CONFLUENCE_URL} />;
};

export default SupportCenterPage;
