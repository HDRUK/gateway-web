import type { Adapter } from "@vercel/flags";
import apis from "@/config/apis";

let cache: Record<string, boolean> | null = null;
let cacheTimestamp: number | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

type FeatureFlagNode = {
    enabled: boolean;
    features?: Record<string, FeatureFlagNode>;
};

type FeatureFlagsApiResponse = Record<string, FeatureFlagNode>;

const flattenFlags = (
    obj: FeatureFlagsApiResponse,
    prefix = ""
): Record<string, boolean> => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        acc[fullKey] = !!value.enabled;

        if (value.features) {
            const nested = flattenFlags(value.features, fullKey);
            Object.assign(acc, nested);
        }

        return acc;
    }, {} as Record<string, boolean>);
};

const setCache = async (): Promise<Record<string, boolean>> => {
    try {
        const res = await fetch(apis.enabledFeatures);
        if (!res.ok) {
            console.error(`Failed to fetch feature flags: ${res.statusText}`);
            return {};
        }

        const json: FeatureFlagsApiResponse = await res.json();
        cacheTimestamp = Date.now();
        return flattenFlags(json);
    } catch (err) {
        console.error(
            "Error fetching feature flags:, will retry after cache is stale",
            err
        );
        cacheTimestamp = Date.now();
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
                return (cache[key] as ValueType) ?? (false as ValueType);
            },
        };
    };
}
