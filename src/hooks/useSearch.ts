import { useTranslations } from "next-intl";
import { CsvExport } from "@/interfaces/CsvExport";
import { SearchCategory, SearchQueryParams } from "@/interfaces/Search";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { downloadCSV } from "@/utils/download";
import { transformQueryFilters } from "@/utils/filters";
import usePost from "./usePost";

const TRANSLATION_PATH = "pages.search";
const SORT_FIELD_DIVIDER = "__";

const useSearch = (
    searchType: string,
    downloadType: string,
    queryParams: SearchQueryParams
) => {
    const t = useTranslations(TRANSLATION_PATH);

    const submitPostRequest = usePost(
        `${apis.searchV1Url}/${searchType}?perPage=${queryParams.per_page}&page=${queryParams.page}`,
        {
            successNotificationsOn: false,
        }
    );

    const handleDownload = async () => {
        const csvData = await submitPostRequest({
            query: queryParams.query,
            sort: queryParams.sort?.split(SORT_FIELD_DIVIDER)[0],
            direction: queryParams.sort?.split(SORT_FIELD_DIVIDER)[1],
            ...transformQueryFilters("dataset", queryParams),
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

            downloadCSV(formattedCSV as CsvExport);
            notificationService.apiSuccess(t("downloadStarted"));
        }
    };

    return {
        handleDownload,
    };
};

export default useSearch;
