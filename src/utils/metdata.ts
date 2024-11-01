import { Metadata } from "next";
import { Robots } from "next/dist/lib/metadata/types/metadata-types";

export interface MetaParams {
    title: string;
    url?: string;
    description: string;
    image?: string;
    siteName?: string;
}

const followRobots: Robots = {
    index: true,
    follow: true,
    googleBot: {
        index: true,
        follow: true
    },
};
export const noFollowRobots: Robots = {
    index: false,
    follow: false,
    googleBot: {
        index: false,
        follow: false
    },
};

export default function metaData(
    meta: MetaParams,
    crawlers: Robots = followRobots
): Metadata {
    return {
        title: `${meta.title} - Health Data Research Innovation Gateway`,
        // metadataBase: new URL(meta.url), // todo
        description: meta.description,
        robots: crawlers,
    };
}
