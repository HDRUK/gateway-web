import { cookies } from "next/headers";
import { Filter } from "@/interfaces/Filter";
import { getFilters } from "@/utils/api";
import metaData, { noFollowRobots } from "@/utils/metadata";
import Search from "./components/Search";

export const metadata = metaData(
    {
        title: "Search",
        description: "",
    },
    noFollowRobots
); // double check robots for search

let filters: Filter[] | null = null;

const fetchFilters = async () => {
    const cookieStore = cookies();
    const filters = await getFilters(cookieStore);
    return filters;
};

const SearchPage = async () => {
    if (!filters) {
        filters = await fetchFilters();
    }

    // TODO - TEMPORARILY HIDE FILTER
    const formattedFilters = filters.filter(
        f => !(f.type === "collection" && f.keys === "publisherName")
    );

    return <Search filters={formattedFilters} />;
};

export default SearchPage;
