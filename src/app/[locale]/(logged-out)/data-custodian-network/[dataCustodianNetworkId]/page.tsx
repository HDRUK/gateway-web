import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Box from "@/components/Box";
import CollectionsContent from "@/components/CollectionsContent";
import DataUsesContent from "@/components/DataUsesContent";
import DatasetsContent from "@/components/DatasetsContent";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import PublicationsContent from "@/components/PublicationsContent";
import ToolsContent from "@/components/ToolsContent";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { StaticImages } from "@/config/images";
import { AspectRatioImage } from "@/config/theme";
import { getDataCustodianNetworks, getNetworkSummary } from "@/utils/api";
import metaData from "@/utils/metadata";
import ActionBar from "./components/ActionBar";
import DataCustodianContent from "./components/DataCustodianContent";
import IntroductionContent from "./components/IntroductionContent";
import { accordions } from "./config";

const TRANSLATION_PATH = "pages.dataCustodianNetwork";

export const metadata = metaData({
    title: "Data Custodian Network",
    description: "",
});

export default async function DataCustodianNetworkPage({
    params,
}: {
    params: { dataCustodianNetworkId: string };
}) {
    const t = await getTranslations(TRANSLATION_PATH);

    const { dataCustodianNetworkId } = params;
    const cookieStore = cookies();

    const summaryData = await getNetworkSummary(
        cookieStore,
        dataCustodianNetworkId,
        {
            suppressError: true,
        }
    );

    if (!summaryData) notFound();

    const networkData = await getDataCustodianNetworks(
        cookieStore,
        dataCustodianNetworkId
    );

    const activeLinkList = accordions.map(section => {
        return {
            label: t(section.sectionName),
        };
    });

    return (
        <LayoutDataItemPage
            navigation={<ActiveListSidebar items={activeLinkList} />}
            body={
                <>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AspectRatioImage
                            width={554}
                            height={250}
                            alt={summaryData.name}
                            src={
                                summaryData?.img_url ||
                                StaticImages.BASE.placeholder
                            }
                        />
                        <Typography variant="h1" sx={{ ml: 2 }}>
                            {summaryData.name}
                        </Typography>
                    </Box>
                    <ActionBar />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}>
                        <IntroductionContent
                            networkData={networkData}
                            anchorIndex={0}
                        />
                        <DataCustodianContent
                            dataCustodians={summaryData.teams_counts}
                            anchorIndex={1}
                        />
                        <DatasetsContent
                            datasets={summaryData.datasets}
                            anchorIndex={2}
                            translationPath={TRANSLATION_PATH}
                        />
                        <DataUsesContent
                            datauses={summaryData.durs}
                            anchorIndex={3}
                            translationPath={TRANSLATION_PATH}
                        />
                        <ToolsContent
                            tools={summaryData.tools}
                            anchorIndex={4}
                            translationPath={TRANSLATION_PATH}
                        />
                        <PublicationsContent
                            publications={summaryData.publications}
                            anchorIndex={5}
                            translationPath={TRANSLATION_PATH}
                        />
                        <CollectionsContent
                            collections={summaryData.collections}
                            anchorIndex={6}
                            translationPath={TRANSLATION_PATH}
                        />
                        {/* Post-MVP: Service Offerings */}
                    </Box>
                </>
            }
        />
    );
}
