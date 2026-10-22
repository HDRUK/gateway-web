import { sessionHeader, sessionPrefix } from "@/config/session";
import { getSessionCookie } from "@/utils/getSessionCookie";

const SEARCH_TIMEOUT = 10000;

interface SearchRequest {
    url: string;
    body: object;
    withPagination: boolean;
}

const getSearchResults = async <T>({
    url,
    body,
    withPagination,
}: SearchRequest): Promise<T | undefined> => {
    try {
        const session = await getSessionCookie();
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                [sessionHeader]: sessionPrefix + session,
            },
            body: JSON.stringify(body),
            cache: "no-store",
            signal: AbortSignal.timeout(SEARCH_TIMEOUT),
        });

        if (!res.ok) {
            return undefined;
        }

        const json = await res.json();

        if (!withPagination) {
            return json.data;
        }

        const { data, current_page, last_page, next_page_url, ...rest } = json;

        return {
            list: data,
            currentPage: current_page,
            lastPage: last_page,
            nextPageUrl: next_page_url,
            ...rest,
        } as T;
    } catch {
        return undefined;
    }
};

export default getSearchResults;
