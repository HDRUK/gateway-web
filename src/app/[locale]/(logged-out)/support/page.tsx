import metaData from "@/utils/metdata";
import SupportCentreLinks from "./components/SupportCentreLinks";

export const metadata = metaData({
    title: "Support centre",
    description: "",
});

export default async function SupportCenter() {
    return <SupportCentreLinks />;
}
