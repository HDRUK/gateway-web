import { cookies } from "next/headers";
import { Filter } from "@/interfaces/Filter";
import { FILTER_DATA_SUBTYPE } from "@/config/forms/filters";
import { getFilters, getSchemaFromTraser } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import Search from "./components/Search";

export const metadata = metaData(
    {
        title: "Search",
        description: "",
    },
    noFollowRobots
);

const SearchPage = async () => {
    const cookieStore = cookies();
    const filters: Filter[] = await getFilters(cookieStore);

    const adjustedFilters = filters.map(filter => {
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

    const SCHEMA_NAME = "HDRUK";
    const SCHEMA_VERSION = "4.0.0";

    const { schema } = await getSchemaFromTraser(
        cookieStore,
        SCHEMA_NAME,
        SCHEMA_VERSION
    );
    return <Search filters={adjustedFilters} schema={schema} />;
};

export default SearchPage;
