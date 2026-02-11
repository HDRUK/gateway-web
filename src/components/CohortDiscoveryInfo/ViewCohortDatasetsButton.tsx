"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { SearchPaginationType, SearchResult } from "@/interfaces/Search";
import Button from "@/components/Button";
import CohortDiscoveryDatasetsDialog from "@/modules/CohortDiscoveryDatasetsDialog";
import useDialog from "@/hooks/useDialog";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";

const TRANSLATION_PATH = "pages.about.cohortDiscovery";
const NHS_SDE_FILTER = "The NHS Research Secure Data Environment (SDE) Network";

const ViewCohortDatasetsButton = ({
    nhsSdeOnly = false,
}: {
    nhsSdeOnly?: boolean;
}) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { showDialog } = useDialog();

    const [data, setData] = useState<SearchPaginationType<SearchResult>>();

    const search = usePost(
        `${apis.searchV1Url}/datasets?view_type=mini&per_page=25&page=1&sort=score:desc`,
        {
            successNotificationsOn: false,
        }
    );

    useEffect(() => {
        (async () => {
            if (data) return;

            const result = await search({
                query: "",
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
            });
            setData(result);
        })();
    }, [data, nhsSdeOnly, search]);

    return (
        <Button
            variant="outlined"
            color="secondary"
            onClick={() => showDialog(CohortDiscoveryDatasetsDialog, { data })}
            sx={{ alignSelf: "flex-start", mt: 1 }}>
            {nhsSdeOnly ? t("viewDatasetsNHS") : t("viewDatasets")}
        </Button>
    );
};

export default ViewCohortDatasetsButton;
