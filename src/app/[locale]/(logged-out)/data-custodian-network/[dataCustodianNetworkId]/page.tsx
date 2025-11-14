import { ReactElement, Suspense } from "react";
import { Skeleton } from "@mui/material";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import DatasetsContent from "@/components/DatasetsContent";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import apis from "@/config/apis";
import { StaticImages } from "@/config/images";
import { AspectRatioImage } from "@/config/theme";
import { getNetworkInfo } from "@/utils/api";
import metaData from "@/utils/metadata";
import ActionBar from "./components/ActionBar";
import DataCustodianContent from "./components/DataCustodianContent";
import IntroductionContent from "./components/IntroductionContent";
import NetworkContent from "./components/NetworkContent";
import { accordions } from "./config";

const TRANSLATION_PATH = "pages.dataCustodianNetwork";

export const metadata = metaData({
    title: "Data Custodian Network",
    description: "",
});

const SkeletonAccordian = ({ title }: { title: string }) => {
    return (
        <Accordion
            variant="plain"
            noIndent
            elevation={0}
            heading={<Typography variant="h3">{title}</Typography>}
            defaultExpanded
            contents={
                <BoxContainer
                    sx={{
                        gridTemplateColumns: {
                            mobile: "repeat(1, 1fr)",
                            desktop: "repeat(3, 1fr)",
                        },
                        gap: 2,
                    }}>
                    {[...Array(6).keys()].map(() => (
                        <Skeleton
                            key="data-custodian"
                            variant="rectangular"
                            height={154}
                            sx={{ bgcolor: "white" }}
                        />
                    ))}
                </BoxContainer>
            }
        />
    );
};

const NetworkSkeleton = (): ReactElement => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}>
            <SkeletonAccordian title="Data Uses" />
            <SkeletonAccordian title="Analysis Scripts & Software" />
            <SkeletonAccordian title="Publications" />
            <SkeletonAccordian title="Collections" />
        </Box>
    );
};

const SectionSkeleton = ({ title }: { title: string }): ReactElement => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}>
            <SkeletonAccordian title={title} />
        </Box>
    );
};

const DataCustodianOuterContent = async ({
    dataCustodianNetworkId,
}: {
    dataCustodianNetworkId: number;
}): Promise<ReactElement> => {
    const resp = await fetch(
        `${apis.dataCustodianNetworkV2UrlIP}/${dataCustodianNetworkId}/custodians_summary`
    );
    if (!resp.ok) {
        throw new Error("Failed to fetch network data");
    }
    const { data: custodiansSummaryData } = await resp.json();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}>
            <DataCustodianContent
                dataCustodians={custodiansSummaryData.teams_counts}
                anchorIndex={1}
            />
        </Box>
    );
};

const DatasetsOuterContent = async ({
    dataCustodianNetworkId,
}: {
    dataCustodianNetworkId: number;
}): Promise<ReactElement> => {
    const resp = await fetch(
        `${apis.dataCustodianNetworkV2UrlIP}/${dataCustodianNetworkId}/datasets_summary`
    );
    if (!resp.ok) {
        throw new Error("Failed to fetch network data");
    }
    const { data: datasetsSummaryData } = await resp.json();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}>
            <DatasetsContent
                datasets={datasetsSummaryData.datasets}
                anchorIndex={2}
                translationPath={TRANSLATION_PATH}
            />
        </Box>
    );
};

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
                        <DataCustodianOuterContent
                            dataCustodianNetworkId={+dataCustodianNetworkId}
                        />
                    </Suspense>
                    <Suspense fallback={<SectionSkeleton title="Datasets" />}>
                        <DatasetsOuterContent
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
