import { useCallback, useEffect, useMemo, useRef } from "react";
import { FieldValues } from "react-hook-form";
import { usePathname, useSearchParams } from "next/navigation";
import { QUERY_FIELD, SORT_FIELD } from "@/config/forms/search";
import {
    buildSearchParams,
    getSearchKey,
    parseQueryParams,
    SearchParamsPatch,
} from "../utils/queryParams";

export const useQueryParams = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const urlKey = searchParams?.toString() ?? "";
    const pendingQuery = useRef<{ from: string; query: string } | null>(null);

    useEffect(() => {
        if (pendingQuery.current && pendingQuery.current.from !== urlKey) {
            pendingQuery.current = null;
        }
    }, [urlKey]);

    const searchKey = getSearchKey(searchParams);
    const queryParams = useMemo(
        () => parseQueryParams(new URLSearchParams(searchKey)),
        [searchKey]
    );

    const getParamString = useCallback(
        (paramName: string) => searchParams?.get(paramName)?.toString(),
        [searchParams]
    );

    const setSearchParams = useCallback(
        (patch: SearchParamsPatch, { resetPage = true } = {}) => {
            const base = pendingQuery.current?.query ?? urlKey;
            const next = buildSearchParams(
                new URLSearchParams(base),
                patch,
                resetPage
            ).toString();

            if (next === base) {
                return;
            }

            pendingQuery.current = { from: urlKey, query: next };
            window.history.pushState(
                null,
                "",
                next ? `${pathname}?${next}` : pathname
            );
        },
        [pathname, urlKey]
    );

    const onQuerySubmit = useCallback(
        (data: FieldValues) => setSearchParams({ [QUERY_FIELD]: data.query }),
        [setSearchParams]
    );

    const onSortChange = useCallback(
        (selectedValue: string) => {
            if (selectedValue === queryParams.sort) {
                return;
            }
            setSearchParams({ [SORT_FIELD]: selectedValue });
        },
        [queryParams.sort, setSearchParams]
    );

    return {
        queryParams,
        pathname,
        searchParams,
        getParamString,
        setSearchParams,
        onQuerySubmit,
        onSortChange,
    };
};
