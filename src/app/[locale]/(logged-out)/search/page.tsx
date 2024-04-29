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

    return <Search filters={filters} />;
};

export default SearchPage;

// 3992
// 3995
// 3993

// There's an issue with _source in payload, am

// 3990
// 3991
