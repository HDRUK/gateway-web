import { cookies } from "next/headers";
import { Filter } from "@/interfaces/Filter";
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

    return <Search filters={filters} cohortDiscovery={cohortDiscovery} />;
};

export default SearchPage;
