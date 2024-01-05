import { DownloadIcon } from "@/consts/icons";
import Button from "@/components/Button";
import { downloadCSV } from "@/utils/download";
import { useTranslations } from "next-intl";
import {
    ACCOUNT,
    COMPONENTS,
    DATASETS,
    PAGES,
    TEAM,
} from "@/consts/translation";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { useEffect, useState } from "react";
import { CsvExport } from "@/interfaces/CohortExport";
import { useParams } from "next/navigation";

const DownloadCSV = () => {
    const { teamId } = useParams();
    const [shouldFetch, setShouldFetch] = useState(false);

    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.DatasetTab`
    );

    const download = useGet<CsvExport>(
        `${apis.datasetsExportV1Url}?team_id=${teamId}`,
        {
            shouldFetch,
        }
    );

    useEffect(() => {
        if (!shouldFetch) return;

        download.mutate().then(data => {
            downloadCSV(data);
            setShouldFetch(false);
        });
    }, [download, shouldFetch]);

    return (
        <Button
            onClick={() => setShouldFetch(true)}
            sx={{ marginBottom: 2 }}
            variant="link"
            startIcon={<DownloadIcon />}>
            {t("downloadButton")}
        </Button>
    );
};

export default DownloadCSV;
