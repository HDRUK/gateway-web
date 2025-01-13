import metaData from "@/utils/metadata";
import SupportCentreLinks from "./components/SupportCentreLinks";

export const metadata = metaData({
    title: "Support Centre",
    description: "",
});

export default async function SupportCenter() {
    return <SupportCentreLinks />;
}
