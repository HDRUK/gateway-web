import { cookies } from "next/headers";
import { getFilters } from "@/utils/api";
import Search from "./components/Search";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Search",
    description: "",
};

const SearchPage = async () => {
    const cookieStore = cookies();
    const filters = await getFilters(cookieStore);

    // TODO - TEMPORARILY HIDE FILTER
    const formattedFilters = filters.filter(
        f => !(f.type === "collection" && f.keys === "publisherName")
    );

    return <Search filters={formattedFilters} />;
};

export default SearchPage;
