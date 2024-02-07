"use client";

import { useCallback, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter } from "@/interfaces/Filter";
import BoxContainer from "@/components/BoxContainer";
import InputWrapper from "@/components/InputWrapper";
import SearchBar from "@/components/SearchBar";
import Tabs from "@/components/Tabs";
import searchFormConfig, {
    QUERY_FIELD,
    SORT_FIELD,
} from "@/config/forms/search";
import FilterPanel from "../FilterPanel";

interface SearchForm {
    query: string;
    sort: string;
}

const TRANSLATION_PATH = "pages.search";

const Search = ({ filters }: { filters: Filter[] }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const t = useTranslations(TRANSLATION_PATH);

    const { control, handleSubmit, getValues, setValue, watch } =
        useForm<SearchForm>({
            defaultValues: searchFormConfig.defaultValues,
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
        console.log(data);
    };

    const categoryTabs = [
        {
            label: t("datasets"),
            value: "datasets",
            content: "",
        },
        {
            label: t("dataUse"),
            value: "data-use",
            content: "",
        },
    ];

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
                    resetAction={() => setValue(QUERY_FIELD, "")}
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
                    tabBoxSx={{ padding: 0 }}
                    rootBoxSx={{ padding: 0 }}
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
                    }}
                />
            </BoxContainer>
        </>
    );
};

export default Search;
