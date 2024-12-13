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
);

const SearchPage = async () => {
    const cookieStore = cookies();
    const filters: Filter[] = await getFilters(cookieStore);
    return <Search filters={filters} />;
};

export default SearchPage;
