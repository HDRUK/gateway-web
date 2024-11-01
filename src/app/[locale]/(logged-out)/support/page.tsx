import SupportCentreLinks from "./components/SupportCentreLinks";
import metaData from "@/utils/metdata";

export const metadata = metaData({
    title: "Support centre",
    description: "",
});

export default async function SupportCenter() {
    return <SupportCentreLinks />;
}
