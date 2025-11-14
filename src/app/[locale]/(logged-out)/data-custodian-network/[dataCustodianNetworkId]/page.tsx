import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Box from "@/components/Box";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import { NetworkSkeleton, SectionSkeleton } from "@/components/Skeletons";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { StaticImages } from "@/config/images";
import { AspectRatioImage } from "@/config/theme";
import { getNetworkInfo } from "@/utils/api";
import metaData from "@/utils/metadata";
import ActionBar from "./components/ActionBar";
import DataCustodianOuter from "./components/DataCustodianOuter";
import DatasetsOuter from "./components/DatasetsOuter";
import IntroductionContent from "./components/IntroductionContent";
import NetworkContent from "./components/NetworkContent";
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

    const infoData = await getNetworkInfo(cookieStore, dataCustodianNetworkId, {
        suppressError: true,
    });

    if (!infoData) notFound();

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
                    <Typography variant="h1" sx={{ ml: 2, mt: 2 }}>
                        {infoData.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", pt: 0 }}>
                        <AspectRatioImage
                            width={554}
                            height={250}
                            alt={infoData.name}
                            src={
                                infoData?.img_url ||
                                StaticImages.BASE.placeholder
                            }
                        />
                    </Box>
                    <ActionBar />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}>
                        <IntroductionContent
                            networkData={infoData}
                            anchorIndex={0}
                        />
                    </Box>
                    <Suspense
                        fallback={<SectionSkeleton title="Data Custodians" />}>
                        <DataCustodianOuter
                            dataCustodianNetworkId={+dataCustodianNetworkId}
                        />
                    </Suspense>
                    <Suspense fallback={<SectionSkeleton title="Datasets" />}>
                        <DatasetsOuter
                            dataCustodianNetworkId={+dataCustodianNetworkId}
                        />
                    </Suspense>
                    <Suspense fallback={<NetworkSkeleton />}>
                        <NetworkContent
                            dataCustodianNetworkId={+dataCustodianNetworkId}
                        />
                    </Suspense>
                </>
            }
        />
    );
}
