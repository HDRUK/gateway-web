import apis from "@/config/apis";
import type { Adapter } from "@vercel/flags";

const { isTest } = process.env;

let cache: Record<string, boolean> | null = null;
let cacheTimestamp: number | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

export interface Feature {
  id: number;
  name: string;
  value: string;
  scope: string | null;
}

export interface FeatureFlagsResponse {
  message: string;
  data: Feature[];
}

const flattenFlags = (
  response: FeatureFlagsResponse
): Record<string, boolean> => {
  const flags: Record<string, boolean> = {};
  response.data.forEach(feature => {
    flags[feature.name] = feature.value === "true";
  });
  return flags;
};

const setCache = async (): Promise<Record<string, boolean>> => {
  try {
    const res = await fetch(apis.features);
    if (!res.ok) {
      console.error(`Failed to fetch feature flags: ${res.statusText}`);
      return {};
    }

    const json: FeatureFlagsResponse = await res.json();
    cacheTimestamp = Date.now();
    return flattenFlags(json);
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

