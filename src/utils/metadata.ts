import { Metadata } from "next";
import { Robots } from "next/dist/lib/metadata/types/metadata-types";

const { BLOCK_ROBOTS } = process.env;
const isBlocked = BLOCK_ROBOTS === "true";

export interface MetaParams {
    title: string;
    isDefault?: boolean;
    url?: string;
    description: string;
    image?: string;
    siteName?: string;
}

const followRobots: Robots = {
    index: !isBlocked,
    follow: !isBlocked,
    googleBot: {
        index: !isBlocked,
        follow: !isBlocked,
    },
};

export const noFollowRobots: Robots = {
    index: false,
    follow: false,
    googleBot: {
        index: false,
        follow: false,
    },
};

export default function metaData(
    meta: MetaParams,
    crawlers: Robots = followRobots
): Metadata {
    return {
        title: meta.isDefault
            ? meta.title
            : `${meta.title} - Health Data Research Gateway`,
        // metadataBase: new URL(meta.url), // todo
        description: meta.description,
        robots: crawlers,
    };
}
