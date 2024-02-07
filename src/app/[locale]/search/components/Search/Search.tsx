"use client";

import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter } from "@/interfaces/Filter";
import { SearchCategory, SearchForm, SearchResult } from "@/interfaces/Search";
import BoxContainer from "@/components/BoxContainer";
import InputWrapper from "@/components/InputWrapper";
import Loading from "@/components/Loading";
import SearchBar from "@/components/SearchBar";
import Tabs from "@/components/Tabs";
import { TabVariant } from "@/components/Tabs/Tabs";
import usePostSwr from "@/hooks/usePostSwr";
import apis from "@/config/apis";
import searchFormConfig, {
    QUERY_FIELD,
    SORT_FIELD,
} from "@/config/forms/search";
import { colors } from "@/config/theme";
import FilterPanel from "../FilterPanel";

const SORT_FIELD_DIVIDER = "__";
const TRANSLATION_PATH = "pages.search";
const TYPE_PARAM = "type";

const Search = ({ filters }: { filters: Filter[] }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const t = useTranslations(TRANSLATION_PATH);

    const getQueryParam = (paramName: string) => {
        return searchParams?.get(paramName)?.toString();
    };

    const { control, handleSubmit, getValues, setValue, watch } =
        useForm<SearchForm>({
            defaultValues: {
                ...searchFormConfig.defaultValues,
                query:
                    getQueryParam(QUERY_FIELD) ||
                    searchFormConfig.defaultValues.query,
                sort:
                    getQueryParam(SORT_FIELD) ||
                    searchFormConfig.defaultValues.sort,
            },
        });
    const watchAll = watch();

    useEffect(() => {
        const selectedOption = searchFormConfig.sortByOptions.find(
            o => o.value === watchAll.sort
        );

        if (!selectedOption?.value) {
            return;
        }

        router.push(
            `${pathname}?${updateQueryString(SORT_FIELD, selectedOption.value)}`
        );
    }, [watchAll.sort]);

    const searchType = getQueryParam(TYPE_PARAM) || SearchCategory.DATASETS;

    const updateQueryString = useCallback(
        (name: string, value: string, existingParams?: string) => {
            const params = existingParams
                ? new URLSearchParams(existingParams)
                : new URLSearchParams(searchParams?.toString());

            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }

            return params.toString();
        },
        [searchParams]
    );

    const onSubmit: SubmitHandler<SearchForm> = async data => {
        router.push(
            `${pathname}?${updateQueryString(QUERY_FIELD, data.query)}`
        );
    };

    const resetQueryInput = () => {
        setValue(QUERY_FIELD, "");
        router.push(`${pathname}?${updateQueryString(QUERY_FIELD, "")}`);
    };

    const { data: searchResults = [], isLoading: isSearching } = usePostSwr<
        SearchResult[]
    >(
        `${apis.searchV1Url}/${searchType}`,
        {
            query: getQueryParam(QUERY_FIELD),
            sort: getQueryParam(SORT_FIELD)?.split(SORT_FIELD_DIVIDER)[0],
            direction: getQueryParam(SORT_FIELD)?.split(SORT_FIELD_DIVIDER)[1],
        },
        {
            successNotificationsOn: false,
        }
    );

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

    // TEMPORARY - Should be updated on the endpoint, currently returned as object of objects
    var formattedSearchResults = Object.values(searchResults);

    return (
        <>
            <Box
                sx={{
                    backgroundColor: "white",
                    paddingRight: 6,
                    paddingLeft: 6,
                }}>
                <SearchBar
                    control={control}
                    explainerText={t("searchExplainer")}
                    resetAction={() => resetQueryInput()}
                    resetDisabled={!getValues(QUERY_FIELD)}
                    submitAction={handleSubmit(onSubmit)}
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
                    paddingTop: "1em",
                    paddingRight: "1em",
                }}
                textAlign="left">
                <Box sx={{ p: 0 }}>
                    <InputWrapper
                        control={control}
                        {...searchFormConfig.sort}
                    />
                </Box>
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
                    <FilterPanel filters={filters} />
                </Box>
                <Box
                    sx={{
                        gridColumn: { tablet: "span 5", laptop: "span 5" },
                    }}>
                    {isSearching && <Loading />}

                    {!isSearching && formattedSearchResults.length === 0 && (
                        <Typography variant="h3">{t("noResults")}</Typography>
                    )}

                    {formattedSearchResults.length > 0 && (
                        <ul>
                            {formattedSearchResults.map(result => (
                                <div>
                                    <Typography variant="h3">
                                        {result._source.shortTitle}
                                    </Typography>
                                    <Typography sx={{ marginBottom: 5 }}>
                                        {result._source.abstract}
                                    </Typography>
                                </div>
                            ))}
                        </ul>
                    )}
                </Box>
            </BoxContainer>
        </>
    );
};

export default Search;
