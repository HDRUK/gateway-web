import { Metadata } from "next";
import { Robots } from "next/dist/lib/metadata/types/metadata-types";
import apis from "@/config/apis";
import { SITE_DESCRIPTION, SITE_NAME } from "@/consts/application";
import { decodeHtmlEntity } from "@/utils/general";

const { BLOCK_ROBOTS } = process.env;
const isBlocked = BLOCK_ROBOTS === "true";

const DESCRIPTION_MAX_LENGTH = 160;

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

export type OgEntityType =
    | "collection"
    | "dataCustodian"
    | "dataCustodianNetwork"
    | "dataset"
    | "dataUse";

export interface MetaParams {
    title: string;
    isDefault?: boolean;
    url?: string;
    description?: string | null;
    image?: string;
    siteName?: string;
    ogType?: "website" | "article";
    entity?: { type: OgEntityType; id: string };
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

interface RichTextNode {
    type?: string;
    text?: string;
    content?: RichTextNode[];
}

const collectRichText = (node: RichTextNode): string =>
    (node.content ?? [])
        .map(child =>
            child.type === "text"
                ? child.text ?? ""
                : ` ${collectRichText(child)} `
        )
        .join("");

const fromRichText = (text: string): string => {
    try {
        const doc = JSON.parse(text);

        if (doc?.type === "doc") {
            return collectRichText(doc);
        }
    } catch {
        return text;
    }

    return text;
};

const fromMarkdown = (text: string): string =>
    text
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/^\s*#{1,6}\s+/gm, "")
        .replace(/(\*\*|__)(\S(?:.*?\S)?)\1/g, "$2");

const withoutTags = (text?: string | null): string =>
    fromRichText(text ?? "").replace(/<\/?[a-z][^>]*>/gi, " ");

const toSingleLine = (text: string): string =>
    decodeHtmlEntity(text).replace(/\s+/g, " ").trim();

export function toPlainText(text?: string | null): string {
    return toSingleLine(withoutTags(text));
}

export function toMetaDescription(text?: string | null): string {
    const plain = toSingleLine(fromMarkdown(withoutTags(text)));

    if (plain.length <= DESCRIPTION_MAX_LENGTH) {
        return plain;
    }

    const cut = plain.slice(0, DESCRIPTION_MAX_LENGTH - 1);
    const lastSpace = cut.lastIndexOf(" ");

    return `${lastSpace > 0 ? cut.slice(0, lastSpace) : cut}…`;
}

const toOgImageUrl = (title: string, entity?: MetaParams["entity"]) =>
    `${apis.ogImageInternalUrl}?${Object.entries({ title, ...entity })
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&")}`;

export default function metaData(
    meta: MetaParams,
    crawlers: Robots = followRobots
): Metadata {
    const pageTitle = toPlainText(meta.title);
    const title = meta.isDefault ? pageTitle : `${pageTitle} - ${SITE_NAME}`;
    const description = toMetaDescription(meta.description) || SITE_DESCRIPTION;
    const image = meta.image ?? toOgImageUrl(pageTitle, meta.entity);

    return {
        title,
        description,
        robots: crawlers,
        ...(meta.url && { alternates: { canonical: meta.url } }),
        openGraph: {
            title,
            description,
            url: meta.url,
            siteName: meta.siteName ?? SITE_NAME,
            type: meta.ogType ?? "website",
            locale: "en_GB",
            images: [{ url: image, ...OG_IMAGE_SIZE, alt: title }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
        },
    };
}
