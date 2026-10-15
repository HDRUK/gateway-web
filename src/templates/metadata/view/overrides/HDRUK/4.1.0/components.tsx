import { ComponentType } from "react";
import { some } from "lodash";
import { SearchCategory } from "@/interfaces/Search";
import HeaderActionBar from "@/components/HeaderActionBar";
import Link from "@/components/Link";
import Typography from "@/components/Typography";
import { RouteName } from "@/consts/routeName";
import ActionBar from "@/app/[locale]/(logged-out)/dataset/[datasetId]/components/ActionBar";
import DatasetMindMap from "@/app/[locale]/(logged-out)/dataset/[datasetId]/components/DatasetMindMap";
import DatasetStats from "@/app/[locale]/(logged-out)/dataset/[datasetId]/components/DatasetStats";
import Linkages from "@/app/[locale]/(logged-out)/dataset/[datasetId]/components/Linkages";
import Publications from "@/app/[locale]/(logged-out)/dataset/[datasetId]/components/Publications";
import Sources from "@/app/[locale]/(logged-out)/dataset/[datasetId]/components/Sources";
import { backBarSx } from "@/app/[locale]/(logged-out)/dataset/[datasetId]/page.styles";
import { Hdruk410 } from "@/generated/schemas/HDRUK/4.1.0";
import {
    BaseVocabulary,
    makeBaseComponents,
    MetadataViewContext,
} from "../../../baseComponents";
import StructuralMetadata from "./components/StructuralMetadata";

export type Section = keyof Hdruk410;

export type Vocabulary = BaseVocabulary<Section> & {
    BackToSearch: ComponentType;
    ActionBar: ComponentType;
    DataCustodianLink: ComponentType;
    DatasetStats: ComponentType;
    DatasetMindMap: ComponentType;
    Sources: ComponentType;
    Linkages: ComponentType;
    Publications: ComponentType;
    StructuralMetadata: ComponentType;
};

export const makeComponents = (ctx: MetadataViewContext): Vocabulary => ({
    ...makeBaseComponents<Section>(ctx),

    BackToSearch: () => (
        <HeaderActionBar
            backButtonText="Back to search results"
            backButtonHref={`/${RouteName.SEARCH}?type=${SearchCategory.DATASETS}`}
            wrapperSx={backBarSx}
        />
    ),

    ActionBar: () => (
        <ActionBar dataset={{ ...ctx.dataset, name: ctx.title }} />
    ),

    DataCustodianLink: () =>
        ctx.dataCustodianName ? (
            <>
                <Typography variant="articleLead" component="span">
                    -
                </Typography>
                <Link
                    variant="articleLead"
                    href={`/${RouteName.DATA_CUSTODIANS_ITEM}/${ctx.dataset.team.id}`}>
                    {ctx.dataCustodianName}
                </Link>
            </>
        ) : null,

    DatasetStats: () => <DatasetStats data={ctx.datasetStats} />,

    DatasetMindMap: () => (
        <DatasetMindMap
            data={ctx.datasetVersion}
            teamId={ctx.dataset.team.id}
            isCohortDiscovery={ctx.dataset.is_cohort_discovery}
            populatedSections={ctx.populatedSections}
            linkageCounts={ctx.linkageCounts}
            hasStructuralMetadata={
                !!ctx.datasetVersion.metadata?.metadata?.structuralMetadata
                    ?.tables?.length
            }
            hasDemographics={
                !!some(
                    ctx.datasetVersion.metadata?.metadata?.demographicFrequency,
                    value => value !== null
                )
            }
        />
    ),

    Sources: () => (
        <Sources
            data={ctx.datasetVersion.metadata.metadata}
            gwdmVersion={ctx.datasetVersion.metadata.gwdmVersion}
        />
    ),

    Linkages: () =>
        ctx.dataset.linkages ? (
            <Linkages linkages={ctx.dataset.linkages} />
        ) : null,

    Publications: () => <Publications data={ctx.dataset} />,

    StructuralMetadata,
});
