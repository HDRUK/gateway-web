import type { Adapter } from "@vercel/flags";
import { cookies } from "next/headers";
import apis from "@/config/apis";
import config from "@/config/config";

export type Features = Record<string, boolean>;

export interface FeatureFlagsResponse {
    message: string;
    data: Features;
}

const getFeatures = async (): Promise<Record<string, boolean>> => {
    try {
        const cookieStore = await cookies();
        const jwtToken = cookieStore?.get(config.JWT_COOKIE)?.value;

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

        return features.data;
    } catch (err) {
        console.error(
            "Error fetching feature flags, will retry after cache is stale",
            err
        );
        return {};
    }
};

export function createAPIFlagAdapter() {
    return function apiFlagAdapter<ValueType, EntitiesType>(): Adapter<
        ValueType,
        EntitiesType
    > {
        return {
            async decide({ key }): Promise<ValueType> {
                const features = await getFeatures();
                return (features[key] ?? false) as ValueType;
            },
        };
    };
}
