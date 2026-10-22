import { ComponentProps } from "react";
import { SearchPageProps } from "@/interfaces/Search";
import getInitialResults from "../../utils/getInitialResults";
import { parseQueryParams, toURLSearchParams } from "../../utils/queryParams";
import Search from "../Search";

type SearchLoaderProps = Omit<
    ComponentProps<typeof Search>,
    "initialResults" | "isPending"
> &
    SearchPageProps;

const SearchLoader = async ({ searchParams, ...props }: SearchLoaderProps) => {
    const params = toURLSearchParams(await searchParams);
    const initialResults = await getInitialResults(
        parseQueryParams(params),
        params.get("force") !== null
    );

    return <Search {...props} initialResults={initialResults} />;
};

export default SearchLoader;
