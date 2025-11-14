import { ReactElement, Suspense } from "react";
import { Skeleton } from "@mui/material";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
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
                            key={`${title}-skeleton`}
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
                pb: 0,
            }}>
            <SkeletonAccordian title={title} />
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
