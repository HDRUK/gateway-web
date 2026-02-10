import type { Adapter } from "@vercel/flags";
import { cookies } from "next/headers";
import apis from "@/config/apis";
import config from "@/config/config";

const { isTest } = process.env;

let cache: Record<string, boolean> | null = null;
let cacheTimestamp: number | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

export type Features = Record<string, boolean>;

export interface FeatureFlagsResponse {
    message: string;
    data: Features;
}

const setCache = async (): Promise<Record<string, boolean>> => {
    try {
        const cookieStore = await cookies();
        const jwtToken = cookieStore.get(config.JWT_COOKIE)?.value;

        //get the features for the current jwt user using /me
        const res = await fetch(`${apis.features}/me`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        if (!res.ok) {
            console.error(`Failed to fetch feature flags: ${res.statusText}`);
            return {};
        }

        const features: FeatureFlagsResponse = await res.json();

        cacheTimestamp = Date.now();
        return features.data;
    } catch (err) {
        console.error(
            "Error fetching feature flags, will retry after cache is stale",
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

export function createAPIFlagAdapter() {
    return function apiFlagAdapter<ValueType, EntitiesType>(): Adapter<
        ValueType,
        EntitiesType
    > {
        return {
            async decide({ key }): Promise<ValueType> {
                if (!cache || isCacheStale()) {
                    cache = await setCache();
                }
                return (cache[key] ?? false) as ValueType;
            },
        };
    };
}
