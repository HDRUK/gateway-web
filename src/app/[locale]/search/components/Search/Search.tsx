"use client";

import { useCallback, useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Box, List, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter } from "@/interfaces/Filter";
import {
    SearchCategory,
    SearchPaginationType,
    SearchQueryParams,
    SearchResult,
} from "@/interfaces/Search";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import Paper from "@/components/Paper";
import SearchBar from "@/components/SearchBar";
import ShowingXofX from "@/components/ShowingXofX";
import Tabs from "@/components/Tabs";
import { TabVariant } from "@/components/Tabs/Tabs";
import ToggleTabs from "@/components/ToggleTabs";
import usePostSwr from "@/hooks/usePostSwr";
import useSearch from "@/hooks/useSearch";
import apis from "@/config/apis";
import {
    FILTER_DATA_USE_TITLES,
    FILTER_PUBLISHER_NAME,
} from "@/config/forms/filters";
import searchFormConfig, {
    QUERY_FIELD,
    SORT_FIELD,
} from "@/config/forms/search";
import { colors } from "@/config/theme";
import { AppsIcon, ViewListIcon, DownloadIcon } from "@/consts/icons";
import { transformQueryFilters } from "@/utils/filters";
import FilterPanel from "../FilterPanel";
import ResultCard from "../ResultCard";
import ResultsTable from "../ResultsTable";
import Sort from "../Sort";

const TRANSLATION_PATH = "pages.search";
export const TYPE_PARAM = "type";

enum ViewType {
    TABLE = "table",
    LIST = "list",
}

const Search = ({ filters }: { filters: Filter[] }) => {
    const [resultsView, setResultsView] = useState(ViewType.TABLE);
    const [isDownloading, setIsDownloading] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const t = useTranslations(TRANSLATION_PATH);

    const getQueryParam = (paramName: string) => {
        return searchParams?.get(paramName)?.toString();
    };

    const searchType = getQueryParam(TYPE_PARAM) || SearchCategory.DATASETS;

    const updateQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams?.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    const [queryParams, setQueryParams] = useState<SearchQueryParams>({
        query:
            getQueryParam(QUERY_FIELD) || searchFormConfig.defaultValues.query,
        sort: getQueryParam(SORT_FIELD) || searchFormConfig.defaultValues.sort,
        [FILTER_DATA_USE_TITLES]: getQueryParam(FILTER_DATA_USE_TITLES),
        [FILTER_PUBLISHER_NAME]: getQueryParam(FILTER_PUBLISHER_NAME),
        page: "1",
        per_page: "25",
    });

    const { handleDownload } = useSearch(searchType, resultsView, queryParams);

    const updatePath = (key: string, value: string) => {
        router.push(`${pathname}?${updateQueryString(key, value)}`);
    };

    const onQuerySubmit = async (data: FieldValues) => {
        setQueryParams({ ...queryParams, ...data });

        updatePath(QUERY_FIELD, data.query);
    };

    const onSortChange = async (selectedValue: string) => {
        setQueryParams({
            ...queryParams,
            sort: selectedValue,
        });

        updatePath(SORT_FIELD, selectedValue);
    };

    const resetQueryInput = () => {
        setQueryParams({ ...queryParams, query: "" });

        updatePath(QUERY_FIELD, "");
    };

    const {
        data,
        isLoading: isSearching,
        mutate,
    } = usePostSwr<SearchPaginationType<SearchResult>>(
        `${apis.searchV1Url}/${searchType}?perPage=${queryParams.per_page}&page=${queryParams.page}&sort=${queryParams.sort}`,
        {
            query: queryParams.query,
            ...transformQueryFilters("dataset", queryParams),
        },
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );

    useEffect(() => {
        mutate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const categoryTabs = [
        {
            label: t("datasets"),
            value: SearchCategory.DATASETS,
            content: "",
        },
        {
            label: t("dataUse"),
            value: SearchCategory.DATA_USE,
            content: "",
        },
        {
            label: t("collections"),
            value: SearchCategory.COLLECTIONS,
            content: "",
        },
        {
            label: t("tools"),
            value: SearchCategory.TOOLS,
            content: "",
        },
    ];

    const toggleButtons = [
        {
            icon: AppsIcon,
            value: ViewType.TABLE,
            label: t("components.Search.toggleLabelTable"),
            onClick: () => setResultsView(ViewType.TABLE),
        },
        {
            icon: ViewListIcon,
            value: ViewType.LIST,
            label: t("components.Search.toggleLabelList"),
            onClick: () => setResultsView(ViewType.LIST),
        },
    ];

    const downloadSearchResults = async () => {
        setIsDownloading(true);
        await handleDownload();
        setIsDownloading(false);
    };

    return (
        <>
            <Box
                sx={{
                    backgroundColor: "white",
                    paddingRight: 6,
                    paddingLeft: 6,
                    display: "flex",
                    justifyContent: "center",
                }}>
                <SearchBar
                    defaultValue={queryParams.query}
                    explainerText={t("searchExplainer")}
                    resetAction={() => resetQueryInput()}
                    isDisabled={!queryParams.query}
                    submitAction={onQuerySubmit}
                    queryPlaceholder={t("searchPlaceholder")}
                    queryName={QUERY_FIELD}
                />
            </Box>
            <Box
                sx={{
                    p: 0,
                    justifyContent: "flex-end",
                    display: "flex",
                    alignItems: "center",
                    padding: "1em",
                }}
                textAlign="left">
                <Box sx={{ p: 0, mr: "1em" }}>
                    <Sort
                        sortName={SORT_FIELD}
                        defaultValue={queryParams.sort}
                        submitAction={onSortChange}
                    />
                </Box>

                <Button
                    onClick={() => !isDownloading && downloadSearchResults()}
                    variant="text"
                    startIcon={<DownloadIcon />}
                    disabled={isDownloading}>
                    {t("downloadResults")}
                </Button>
            </Box>
            <Box>
                <Tabs
                    centered
                    tabs={categoryTabs}
                    tabBoxSx={{
                        paddingLeft: 4,
                        paddingRight: 4,
                        borderBottom: `1px solid ${colors.green400}`,
                        marginBottom: 1,
                    }}
                    rootBoxSx={{ padding: 0 }}
                    variant={TabVariant.LARGE}
                    paramName={TYPE_PARAM}
                />
            </Box>
            <BoxContainer
                sx={{
                    gridTemplateColumns: {
                        mobile: "repeat(1, 1fr)",
                        tablet: "repeat(7, 1fr)",
                    },
                    gap: {
                        mobile: 0,
                        tablet: 1,
                    },
                }}>
                <Box
                    sx={{
                        gridColumn: { tablet: "span 2", laptop: "span 2" },
                    }}>
                    <FilterPanel
                        filters={filters}
                        setFilterQueryParams={(
                            params: {
                                [key: string]: string[];
                            },
                            updatedSection: string
                        ) => {
                            updatePath(
                                updatedSection,
                                params[updatedSection].join(", ")
                            );
                            setQueryParams({ ...queryParams, ...params });
                        }}
                        aggregations={data?.aggregations}
                    />
                </Box>
                <Box
                    sx={{
                        gridColumn: { tablet: "span 5", laptop: "span 5" },
                    }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            m: 2,
                        }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}>
                            <ShowingXofX
                                to={data?.to}
                                from={data?.from}
                                total={data?.total}
                            />
                            <ToggleTabs<ViewType>
                                selected={resultsView}
                                buttons={toggleButtons}
                            />
                        </Box>

                        {isSearching && <Loading />}

                        {!isSearching && !data?.list.length && (
                            <Paper sx={{ textAlign: "center", p: 5 }}>
                                <Typography variant="h3">
                                    {t("noResults")}
                                </Typography>
                            </Paper>
                        )}
                        {!isSearching && !!data?.list.length && (
                            <>
                                {resultsView === ViewType.LIST && (
                                    <List
                                        sx={{
                                            width: "100%",
                                            bgcolor: "background.paper",
                                            mb: 2,
                                            pb: 2,
                                        }}>
                                        {data?.list.map(result => (
                                            <ResultCard result={result} />
                                        ))}
                                    </List>
                                )}
                                {resultsView === ViewType.TABLE && (
                                    <ResultsTable results={data?.list} />
                                )}
                                <Pagination
                                    isLoading={isSearching}
                                    page={parseInt(queryParams.page, 10)}
                                    count={data?.lastPage}
                                    onChange={(
                                        e: React.ChangeEvent<unknown>,
                                        page: number
                                    ) =>
                                        setQueryParams({
                                            ...queryParams,
                                            page: page.toString(),
                                        })
                                    }
                                />
                            </>
                        )}
                    </Box>
                </Box>
            </BoxContainer>
        </>
    );
};

export default Search;
