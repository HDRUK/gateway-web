import { cookies } from "next/headers";
import { Filter } from "@/interfaces/Filter";
import { FILTER_DATA_SUBTYPE } from "@/config/forms/filters";
import { getFilters } from "@/utils/api";
import { getCohortDiscovery } from "@/utils/cms";
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
    const cohortDiscovery = await getCohortDiscovery();

    filters.forEach(filter => {
        if (filter.keys === FILTER_DATA_SUBTYPE) {
            filter.buckets = filter.buckets.filter(
                bucket => bucket.key !== "Not applicable"
            );
        }
    });

    return <Search filters={filters} cohortDiscovery={cohortDiscovery} />;
};

export default SearchPage;
