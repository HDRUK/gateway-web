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

const ViewCohortDatasetsButton = () => {
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
                        populationSize: { includeUnreported: true },
                        isCohortDiscovery: [true],
                        sampleAvailability: [],
                    },
                },
            });
            setData(result);
        })();
    }, [data, search]);

    return (
        <Button
            variant="outlined"
            color="secondary"
            onClick={() => showDialog(CohortDiscoveryDatasetsDialog, { data })}>
            {t("viewDatasets")}
        </Button>
    );
};

export default ViewCohortDatasetsButton;
