import type { Adapter } from "@vercel/flags";
import apis from "@/config/apis";

let cache: Record<string, boolean> | null = null;
let cacheTimestamp: number | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const setCache = async (): Promise<Record<string, boolean>> => {
    try {
        const res = await fetch(apis.enablebFeatures);
        console.log("here");
        if (!res.ok) {
            console.error(`Failed to fetch feature flags: ${res.statusText}`);
            return {};
        }

        const json = await res.json();

        cacheTimestamp = Date.now();
        return Object.entries(json).reduce(
            (acc: Record<string, boolean>, [key, value]: [string, any]) => {
                acc[key] = !!value?.enabled;
                return acc;
            },
            {}
        );
    } catch (err) {
        console.error("Error fetching feature flags:", err);
        return {};
    }
};

const isCacheStale = () => {
    if (!cacheTimestamp) return true;
    return Date.now() - cacheTimestamp > CACHE_TTL_MS;
};

export function createGatewayFlagAdapter() {
    return function gatewayFlagAdapter<ValueType, EntitiesType>(): Adapter<
        ValueType,
        EntitiesType
    > {
        return {
            async decide({ key }): Promise<ValueType> {
                if (!cache || isCacheStale()) {
                    cache = await setCache();
                }
                return cache[key] as ValueType;
            },
        };
    };
}
