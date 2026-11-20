/* eslint-disable @next/next/no-img-element */
import { tokens } from "@hdruk/ui/theme";
import { get } from "lodash";
import { hasRemoteMatch } from "next/dist/shared/lib/match-remote-pattern";
import { ImageResponse } from "next/og";
import { StaticImages } from "@/config/images";
import remoteImagePatterns from "@/config/remoteImagePatterns";
import { SITE_NAME } from "@/consts/application";
import {
    getDataUse,
    getDataset,
    getNetworkInfo,
    getReducedCollection,
    getTeamInfo,
} from "@/utils/api";
import { logger } from "@/utils/logger";
import { OG_IMAGE_SIZE, OgEntityType } from "@/utils/metadata";

const TITLE_MAX_LENGTH = 100;
const FETCH_TIMEOUT_MS = 3000;
const MAX_IMAGE_BYTES = 5_000_000;
const SUPPORTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/svg+xml"];
const CACHE_CONTROL = "public, max-age=86400";
const FONT_FAMILY = "Source Sans 3";
const FONT_URL =
    "https://fonts.gstatic.com/s/sourcesans3/v20/nwpBtKy2OAdR1K-IwhWudF-R9QMylBJAV3Bo8Kxf7FEN.ttf";
const LOG_LOCATION = "api/og";
const PUBLIC_GET = { suppressError: true, isPublic: true };

const fetchOk = async (url: string, init?: RequestInit) => {
    const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
        throw new Error(`${response.status} fetching ${url}`);
    }

    return response;
};

const contentTypeOf = (response: Response) =>
    (response.headers.get("content-type") ?? "").split(";")[0].trim();

const toImageDataUri = async (response: Response) => {
    const contentType = contentTypeOf(response);

    if (!SUPPORTED_IMAGE_TYPES.includes(contentType)) {
        throw new Error(`Unsupported image type ${contentType}`);
    }

    const declaredBytes = Number(response.headers.get("content-length"));

    if (declaredBytes > MAX_IMAGE_BYTES) {
        throw new Error(`Image too large (${declaredBytes} bytes)`);
    }

    const data = Buffer.from(await response.arrayBuffer());

    if (data.length > MAX_IMAGE_BYTES) {
        throw new Error(`Image too large (${data.length} bytes)`);
    }

    return `data:${contentType};base64,${data.toString("base64")}`;
};

const cacheUntilFailure = <T,>(name: string, load: () => Promise<T>) => {
    let promise: Promise<T | undefined> | undefined;

    return () => {
        if (!promise) {
            promise = load().catch(error => {
                logger.error(`${name}: ${error}`, "", LOG_LOCATION);
                promise = undefined;
                return undefined;
            });
        }

        return promise;
    };
};

const getFont = cacheUntilFailure("font", async () =>
    (await fetchOk(FONT_URL)).arrayBuffer()
);

const getLogo = cacheUntilFailure("logo", async () =>
    toImageDataUri(await fetchOk(StaticImages.BASE.logo))
);

const fetchEntityImage = async (url: string) => {
    if (!hasRemoteMatch([], remoteImagePatterns, new URL(url))) {
        throw new Error(`Image host not allowed: ${url}`);
    }

    const response = await fetchOk(url, { redirect: "error" });
    const contentType = contentTypeOf(response);

    if (!SUPPORTED_IMAGE_TYPES.includes(contentType)) {
        logger.warn(
            `Unsupported image type ${contentType}: ${url}`,
            "",
            LOG_LOCATION
        );
        return undefined;
    }

    return toImageDataUri(response);
};

const requireEntity = <T,>(entity: T | undefined): T => {
    if (!entity) {
        throw new Error("Entity not returned");
    }

    return entity;
};

const ENTITY_IMAGE_URLS: Record<
    OgEntityType,
    (id: string) => Promise<string | null | undefined>
> = {
    collection: async id => {
        const collection = requireEntity(
            await getReducedCollection(id, PUBLIC_GET)
        );

        return collection.image_link || get(collection, "team.team_logo");
    },
    dataCustodian: async id =>
        requireEntity(await getTeamInfo(id, PUBLIC_GET)).team_logo,
    dataCustodianNetwork: async id =>
        requireEntity(await getNetworkInfo(id, PUBLIC_GET)).img_url,
    dataset: async id =>
        get(
            requireEntity(
                await getDataset(
                    id,
                    "SchemaOrg",
                    "GoogleRecommended",
                    PUBLIC_GET
                )
            ),
            "team.team_logo"
        ),
    dataUse: async id =>
        get(requireEntity(await getDataUse(id, PUBLIC_GET)), "team.team_logo"),
};

const isEntityType = (type: string): type is OgEntityType =>
    Object.hasOwn(ENTITY_IMAGE_URLS, type);

interface EntityImage {
    src?: string;
    failed: boolean;
}

const NO_ENTITY_IMAGE: EntityImage = { failed: false };

const getEntityImage = async (
    type: string | null,
    id: string | null
): Promise<EntityImage> => {
    if (!type || !id || !/^\d+$/.test(id) || !isEntityType(type)) {
        return NO_ENTITY_IMAGE;
    }

    try {
        const url = await ENTITY_IMAGE_URLS[type](id);

        if (!url) {
            return NO_ENTITY_IMAGE;
        }

        return {
            src: await fetchEntityImage(url),
            failed: false,
        };
    } catch (error) {
        logger.warn(`${type} ${id} image: ${error}`, "", LOG_LOCATION);
        return { failed: true };
    }
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const rawTitle = searchParams.get("title")?.trim();
    const title =
        rawTitle && rawTitle.length > TITLE_MAX_LENGTH
            ? `${rawTitle.slice(0, TITLE_MAX_LENGTH - 1)}…`
            : rawTitle;
    const isSiteCard = !title || title === SITE_NAME;
    const [logo, font, { src: entityImage, failed: entityImageFailed }] =
        await Promise.all([
            getLogo(),
            getFont(),
            isSiteCard
                ? NO_ENTITY_IMAGE
                : getEntityImage(
                      searchParams.get("type"),
                      searchParams.get("id")
                  ),
        ]);

    const brand = logo ? (
        <img
            src={logo}
            width={isSiteCard ? 595 : 238}
            height={isSiteCard ? 240 : 96}
            alt=""
        />
    ) : (
        <div style={{ display: "flex", fontSize: isSiteCard ? 64 : 32 }}>
            {SITE_NAME}
        </div>
    );

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isSiteCard ? "center" : "space-between",
                    padding: 80,
                    gap: 48,
                    fontFamily: FONT_FAMILY,
                    fontWeight: 700,
                    backgroundColor: tokens.brand.primary,
                    color: tokens.text.primaryWhite,
                }}>
                {isSiteCard ? (
                    brand
                ) : (
                    <div
                        style={{
                            flex: 1,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}>
                        {brand}
                        <div
                            style={{
                                display: "flex",
                                fontSize: entityImage ? 56 : 64,
                                lineHeight: 1.2,
                            }}>
                            {title}
                        </div>
                    </div>
                )}
                {entityImage && (
                    <div
                        style={{
                            width: 420,
                            height: 360,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 32,
                            borderRadius: 16,
                            backgroundColor: tokens.background.white,
                        }}>
                        <img
                            src={entityImage}
                            width={356}
                            height={296}
                            style={{ objectFit: "contain" }}
                            alt=""
                        />
                    </div>
                )}
            </div>
        ),
        {
            ...OG_IMAGE_SIZE,
            fonts: font
                ? [{ name: FONT_FAMILY, data: font, weight: 700 }]
                : undefined,
            headers: {
                "Cache-Control":
                    logo && font && !entityImageFailed
                        ? CACHE_CONTROL
                        : "no-store",
            },
        }
    );
}
