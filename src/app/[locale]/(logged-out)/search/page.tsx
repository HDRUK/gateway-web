import { Suspense } from "react";
import { cookies } from "next/headers";
import { Filter } from "@/interfaces/Filter";
import { SearchPageProps } from "@/interfaces/Search";
import config from "@/config/config";
import { FILTER_DATA_SUBTYPE } from "@/config/forms/filters";
import { SCHEMA_NAME, SCHEMA_VERSION } from "@/consts/schema";
import { getFilters, getSchemaFromTraser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import Search from "./components/Search";
import SearchLoader from "./components/SearchLoader";

export const metadata = metaData(
    {
        title: "Search",
        description: "",
    },
    noFollowRobots
);

const getSearchFilters = async () => {
    const filters: Filter[] = await getFilters();

    return filters.map(filter => {
        if (filter.keys === FILTER_DATA_SUBTYPE) {
            return {
                ...filter,
                buckets: filter.buckets.filter(
                    bucket => bucket.key !== "Not applicable"
                ),
            };
        }
        return filter;
    });
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
    const [filters, { schema }, cookieStore] = await Promise.all([
        getSearchFilters(),
        getSchemaFromTraser(SCHEMA_NAME, SCHEMA_VERSION),
        cookies(),
    ]);
    const initialView = cookieStore.get(config.VIEW_TYPE)?.value;

    return (
        <Suspense
            fallback={
                <Search
                    filters={filters}
                    schema={schema}
                    initialView={initialView}
                    isPending
                />
            }>
            <SearchLoader
                searchParams={searchParams}
                filters={filters}
                schema={schema}
                initialView={initialView}
            />
        </Suspense>
    );
};

export default SearchPage;
