"use client";

import { useEffect, useState } from "react";
import { Button } from "@hdruk/ui";
import { useTranslations } from "next-intl";
import {
    SearchAggregationData,
    SearchCategory,
    SearchResultDataset,
} from "@/interfaces/Search";
import CohortDiscoveryDatasetsDialog from "@/modules/CohortDiscoveryDatasetsDialog";
import useDialog from "@/hooks/useDialog";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import { NHS_SDE_FILTER } from "@/consts/cohortDiscovery";
import { HDRUK_SOURCE_VALUE } from "@/consts/search";

const TRANSLATION_PATH = "pages.about.cohortDiscovery";

const ViewCohortDatasetsButton = ({
    nhsSdeOnly = false,
}: {
    nhsSdeOnly?: boolean;
}) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { showDialog } = useDialog();

    const [data, setData] = useState<SearchResultDataset[]>();

    const search = usePost(apis.searchV2AggregationUrl, {
        successNotificationsOn: false,
    });

    useEffect(() => {
        (async () => {
            if (data) return;

            const result = (await search({
                type: SearchCategory.DATASETS,
                query: "",
                page: 1,
                per_page: 25,
                sort: "title:asc",
                view_type: "mini",
                dataSource: HDRUK_SOURCE_VALUE,
                providers: [HDRUK_SOURCE_VALUE],
                filters: {
                    dataset: {
                        dataProviderColl: nhsSdeOnly ? [NHS_SDE_FILTER] : [],
                        populationSize: {
                            includeUnreported: false,
                        },
                        isCohortDiscovery: [true],
                        sampleAvailability: [],
                        collectionName: [],
                    },
                },
            })) as SearchAggregationData | null;
            setData(
                result?.results?.[HDRUK_SOURCE_VALUE]?.hits as
                    | SearchResultDataset[]
                    | undefined
            );
        })();
    }, [data, nhsSdeOnly, search]);

    return (
        <Button
            purpose="secondary"
            disabled={!data}
            onClick={() =>
                showDialog(CohortDiscoveryDatasetsDialog, { data, nhsSdeOnly })
            }
            sx={{ alignSelf: "flex-start", mt: 1 }}>
            {nhsSdeOnly ? t("viewDatasetsNHS") : t("viewDatasets")}
        </Button>
    );
};

export default ViewCohortDatasetsButton;
