import Cookies from "js-cookie";
import { SearchCategory, ViewType } from "@/interfaces/Search";
import config from "@/config/config";
import { VIEW_FIELD } from "@/config/forms/search";
import { SearchParamsPatch } from "../utils/queryParams";
import { getResultsView } from "../utils/results";

const useResultsView = (
    type: SearchCategory,
    urlView: string | undefined,
    setSearchParams: (
        patch: SearchParamsPatch,
        options?: { resetPage?: boolean }
    ) => void,
    initialView?: string
) => {
    const resultsView = getResultsView(
        type,
        urlView,
        Cookies.get(config.VIEW_TYPE) ?? initialView
    );

    const toggleView = () => {
        const viewType =
            resultsView === ViewType.LIST ? ViewType.TABLE : ViewType.LIST;

        Cookies.set(config.VIEW_TYPE, viewType);
        setSearchParams({ [VIEW_FIELD]: viewType }, { resetPage: false });
    };

    return { resultsView, toggleView };
};

export default useResultsView;
