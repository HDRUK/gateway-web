import { useTranslations } from "next-intl";
import { CsvExport } from "@/interfaces/CsvExport";
import { SearchCategory, SearchQueryParams } from "@/interfaces/Search";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { downloadCSV } from "@/utils/download";
import { pickOnlyFilters } from "@/utils/filters";
import usePost from "./usePost";

const TRANSLATION_PATH = "pages.search";

const useSearch = (
    searchType: string,
    downloadType: string,
    queryParams: SearchQueryParams
) => {
    const t = useTranslations(TRANSLATION_PATH);

    const submitPostRequest = usePost(
        `${apis.searchV1Url}/${searchType}?perPage=${queryParams.per_page}&page=${queryParams.page}&sort=${queryParams.sort}`,
        {
            successNotificationsOn: false,
        }
    );

    const handleDownload = async () => {
        const csvData = await submitPostRequest({
            query: queryParams.query,
            ...pickOnlyFilters("dataset", queryParams),
            download: true,
            download_type: downloadType,
        });

        if (csvData) {
            const filename = `${
                queryParams.type || SearchCategory.DATASETS
            }.csv`;

            const formattedCSV = {
                content: csvData,
                type: "text/csv",
                filename,
            };

            notificationService.apiSuccess(t("downloadStarted"));
            downloadCSV(formattedCSV as CsvExport);
        }
    };

    return {
        handleDownload,
    };
};

export default useSearch;
