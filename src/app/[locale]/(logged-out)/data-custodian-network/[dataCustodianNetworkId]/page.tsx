import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Box from "@/components/Box";
import DatasetsContent from "@/components/DatasetsContent";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import PublicationsContent from "@/components/PublicationsContent";
import ToolsContent from "@/components/ToolsContent";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { StaticImages } from "@/config/images";
import { AspectRatioImage } from "@/config/theme";
import { getDataCustodianNetworks, getNetworkSummary } from "@/utils/api";
import ActionBar from "./components/ActionBar";
import DataCustodianContent from "./components/DataCustodianContent";
import DatausesContent from "./components/DatausesContent";
import IntroductionContent from "./components/IntroductionContent";
import { accordions } from "./config";

const TRANSLATION_PATH = "pages.dataCustodianNetwork";

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
        dataCustodianNetworkId
    );
    const networkData = await getDataCustodianNetworks(
        cookieStore,
        dataCustodianNetworkId
    );

    const activeLinkList = accordions.map(section => {
        return {
            label: t(section.sectionName),
        };
    });

    const page = "dataCustodianNetwork";

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
                            page={page}
                        />
                        <ToolsContent
                            tools={summaryData.tools}
                            anchorIndex={3}
                            page={page}
                        />
                        <DatausesContent
                            datauses={summaryData.durs}
                            anchorIndex={4}
                        />
                        <PublicationsContent
                            publications={summaryData.publications}
                            anchorIndex={5}
                            page={page}
                        />
                        {/* Post-MVP: Service Offerings */}
                    </Box>
                </>
            }
        />
    );
}
