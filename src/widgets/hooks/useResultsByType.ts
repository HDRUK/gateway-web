"use client";

import { useMemo } from "react";
import {
    WidgetEntityData,
    DatasetItem,
    CollectionItem,
    ScriptItem,
    DataUseItem,
} from "@/interfaces/Widget";
import useTextFilter from "./useTextFilter";

type ResultsByType = {
    datasets: DatasetItem[];
    collections: CollectionItem[];
    data_uses: DataUseItem[];
    scripts: ScriptItem[];
};

export default function useResultsByType(
    data: WidgetEntityData,
    searchValue: string
) {
    const { makeTextFilter } = useTextFilter();

    return useMemo<ResultsByType>(() => {
        const datasetsFilter = makeTextFilter<DatasetItem>(
            ["title", "short_title", "description", "publisher"],
            searchValue
        );
        const collectionsFilter = makeTextFilter<CollectionItem>(
            ["name"],
            searchValue
        );
        const dataUsesFilter = makeTextFilter<DataUseItem>(
            ["name", "organisation_name", "team_name"],
            searchValue
        );
        const scriptsFilter = makeTextFilter<ScriptItem>(
            ["name", "description"],
            searchValue
        );

        return {
            datasets: (data.datasets ?? []).filter(datasetsFilter),
            collections: (data.collections ?? []).filter(collectionsFilter),
            data_uses: (data.data_uses ?? []).filter(dataUsesFilter),
            scripts: (data.scripts ?? []).filter(scriptsFilter),
        };
    }, [data, makeTextFilter, searchValue]);
}
