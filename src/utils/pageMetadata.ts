import { cache } from "react";
import { get } from "lodash";
import { GetOptions } from "@/interfaces/Response";
import {
    DataStatus,
    EntityType,
    PAGE_TITLE_FALLBACKS,
} from "@/consts/application";
import { CmsCategory } from "@/consts/cms";
import { RouteName } from "@/consts/routeName";
import {
    getDataUse,
    getDataset,
    getNetworkInfo,
    getPublication,
    getReducedCollection,
    getReducedTool,
    getTeamInfo,
} from "@/utils/api";
import { getContentPostQuery, hasCategoryName } from "@/utils/cms";
import { getLatestVersion } from "@/utils/dataset";
import metaData, { MetaParams } from "@/utils/metadata";

interface PageContent {
    title?: string | null;
    description?: string | null;
    image?: string | null;
}

interface PageType {
    route: RouteName;
    fallbackTitle: (id: string) => string;
    titleSuffix?: string;
    ogType?: MetaParams["ogType"];
    load: (
        id: string,
        options: GetOptions
    ) => Promise<PageContent | null | undefined>;
}

const PAGE_OPTIONS: GetOptions = { suppressError: true };
const CARD_OPTIONS: GetOptions = { suppressError: true, isPublic: true };

export const getNewsArticle = cache((slug: string) =>
    getContentPostQuery("getNewsArticle", { id: slug, idType: "SLUG" })
);

export const getEventArticle = cache((slug: string) =>
    getContentPostQuery("getEventsArticle", { id: slug, idType: "SLUG" })
);

const fromSlug = (slug: string) => slug.replaceAll("-", " ");

const isActive = (entity?: { status?: string | null } | null) =>
    entity?.status === DataStatus.ACTIVE;

const toArticle = async (
    post: Awaited<ReturnType<typeof getContentPostQuery>>,
    category: CmsCategory
) =>
    post && (await hasCategoryName(post.categories, category))
        ? { title: post.title, description: post.content }
        : undefined;

const PAGE_TYPES: Record<EntityType, PageType> = {
    [EntityType.COLLECTION]: {
        route: RouteName.COLLECTION_ITEM,
        fallbackTitle: () => PAGE_TITLE_FALLBACKS[EntityType.COLLECTION],
        load: async (id, options) => {
            const collection = await getReducedCollection(id, options);

            return isActive(collection)
                ? {
                      title: collection.name,
                      description: collection.description,
                      image:
                          collection.image_link ||
                          get(collection, "team.team_logo"),
                  }
                : undefined;
        },
    },
    [EntityType.DATASET]: {
        route: RouteName.DATASET_ITEM,
        fallbackTitle: () => PAGE_TITLE_FALLBACKS[EntityType.DATASET],
        load: async (id, options) => {
            const dataset = await getDataset(
                id,
                "SchemaOrg",
                "GoogleRecommended",
                options
            );
            const latestVersion = dataset && getLatestVersion(dataset);

            return isActive(dataset)
                ? {
                      title: get(latestVersion, "metadata.metadata.name"),
                      description: get(
                          latestVersion,
                          "metadata.metadata.description"
                      ),
                      image: get(dataset, "team.team_logo"),
                  }
                : undefined;
        },
    },
    [EntityType.DATA_CUSTODIAN]: {
        route: RouteName.DATA_CUSTODIANS_ITEM,
        fallbackTitle: () => PAGE_TITLE_FALLBACKS[EntityType.DATA_CUSTODIAN],
        load: async (id, options) => {
            const team = await getTeamInfo(id, options);

            return (
                team && {
                    title: team.name,
                    description: team.introduction,
                    image: team.team_logo,
                }
            );
        },
    },
    [EntityType.DATA_CUSTODIAN_NETWORK]: {
        route: RouteName.DATA_CUSTODIAN_NETWORK_ITEM,
        fallbackTitle: () =>
            PAGE_TITLE_FALLBACKS[EntityType.DATA_CUSTODIAN_NETWORK],
        load: async (id, options) => {
            const network = await getNetworkInfo(id, options);

            return (
                network && {
                    title: network.name,
                    description: network.summary,
                    image: network.img_url,
                }
            );
        },
    },
    [EntityType.DATA_USE]: {
        route: RouteName.DATA_USE_ITEM,
        fallbackTitle: () => PAGE_TITLE_FALLBACKS[EntityType.DATA_USE],
        load: async (id, options) => {
            const dataUse = await getDataUse(id, options);

            return isActive(dataUse)
                ? {
                      title: dataUse.project_title,
                      description: dataUse.lay_summary,
                      image: get(dataUse, "team.team_logo"),
                  }
                : undefined;
        },
    },
    [EntityType.TOOL]: {
        route: RouteName.TOOL_ITEM,
        fallbackTitle: () => PAGE_TITLE_FALLBACKS[EntityType.TOOL],
        load: async (id, options) => {
            const tool = await getReducedTool(id, options);

            return isActive(tool)
                ? { title: tool.name, description: tool.description }
                : undefined;
        },
    },
    [EntityType.PUBLICATION]: {
        route: RouteName.PUBLICATION,
        fallbackTitle: () => PAGE_TITLE_FALLBACKS[EntityType.PUBLICATION],
        load: async (id, options) => {
            const publication = await getPublication(id, options);

            return isActive(publication)
                ? {
                      title: publication.paper_title,
                      description: publication.abstract,
                  }
                : undefined;
        },
    },
    [EntityType.NEWS_ARTICLE]: {
        route: RouteName.NEWS_ARTICLE,
        fallbackTitle: fromSlug,
        titleSuffix: " - News",
        ogType: "article",
        load: async slug =>
            toArticle(await getNewsArticle(slug), CmsCategory.NEWS),
    },
    [EntityType.EVENT_ARTICLE]: {
        route: RouteName.EVENT_ARTICLE,
        fallbackTitle: fromSlug,
        titleSuffix: " - Events",
        ogType: "article",
        load: async slug =>
            toArticle(await getEventArticle(slug), CmsCategory.EVENTS),
    },
};

const toTitle = (type: EntityType, id: string, title?: string | null) => {
    const { fallbackTitle, titleSuffix = "" } = PAGE_TYPES[type];

    return `${title || fallbackTitle(id)}${titleSuffix}`;
};

export const isPageType = (type: string): type is EntityType =>
    Object.hasOwn(PAGE_TYPES, type);

export async function pageMetaData(
    type: EntityType,
    id: string,
    locale: string
) {
    const { route, ogType, load } = PAGE_TYPES[type];
    const page = await load(id, PAGE_OPTIONS).catch(() => undefined);

    return metaData({
        title: toTitle(type, id, page?.title),
        description: page?.description,
        url: `/${locale}/${route}/${id}`,
        ogType,
        entity: { type, id },
    });
}

export async function loadPageCard(type: EntityType, id: string) {
    const page = await PAGE_TYPES[type].load(id, CARD_OPTIONS);

    return page && { title: toTitle(type, id, page.title), image: page.image };
}
