import {
    DataStatus,
    EntityType,
    PAGE_TITLE_FALLBACKS,
    SITE_NAME,
} from "@/consts/application";
import { CmsCategory } from "@/consts/cms";
import { loadPageCard, pageMetaData } from "./pageMetadata";

const getReducedCollectionMock = jest.fn();
const getContentPostQueryMock = jest.fn();

jest.mock("@/utils/api", () => ({
    getReducedCollection: (...args: unknown[]) =>
        getReducedCollectionMock(...args),
}));

jest.mock("@/utils/cms", () => ({
    ...jest.requireActual("@/utils/cms"),
    getContentPostQuery: (...args: unknown[]) =>
        getContentPostQueryMock(...args),
}));

const newsPost = (title: string, category: CmsCategory) => ({
    title,
    content: "",
    categories: { nodes: [{ name: category }] },
});

describe("pageMetaData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("falls back to the type's title when the entity is missing", async () => {
        getReducedCollectionMock.mockResolvedValue(undefined);

        const result = await pageMetaData(EntityType.COLLECTION, "80", "en");

        expect(result.title).toBe(
            `${PAGE_TITLE_FALLBACKS[EntityType.COLLECTION]} - ${SITE_NAME}`
        );
    });

    it("titles the page and points its card at the entity", async () => {
        getReducedCollectionMock.mockResolvedValue({
            name: "DataLoch",
            description: "Linked records",
            status: DataStatus.ACTIVE,
        });

        const result = await pageMetaData(EntityType.COLLECTION, "80", "en");

        expect(result.title).toBe(`DataLoch - ${SITE_NAME}`);
        expect(result.alternates).toEqual({ canonical: "/en/collection/80" });
        expect(result.twitter).toEqual(
            expect.objectContaining({
                images: ["/api/og?type=collection&id=80"],
            })
        );
    });

    it.each([DataStatus.DRAFT, DataStatus.ARCHIVED])(
        "reveals nothing about a %s entity",
        async status => {
            getReducedCollectionMock.mockResolvedValue({
                name: "Unpublished study",
                description: "Private notes",
                image_link: "https://media.prod.hdruk.cloud/private.png",
                status,
            });

            const result = await pageMetaData(EntityType.COLLECTION, "2", "en");

            expect(JSON.stringify(result)).not.toMatch(
                /Unpublished study|Private notes|private\.png/
            );
            expect(result.title).toBe(
                `${PAGE_TITLE_FALLBACKS[EntityType.COLLECTION]} - ${SITE_NAME}`
            );
            await expect(
                loadPageCard(EntityType.COLLECTION, "2")
            ).resolves.toBe(undefined);
        }
    );

    it("suffixes article titles, loaded or from the slug", async () => {
        getContentPostQueryMock.mockResolvedValueOnce(
            newsPost("Spring update", CmsCategory.NEWS)
        );
        getContentPostQueryMock.mockResolvedValueOnce(undefined);

        const loaded = await pageMetaData(
            EntityType.NEWS_ARTICLE,
            "spring-update",
            "en"
        );
        const missing = await pageMetaData(
            EntityType.NEWS_ARTICLE,
            "autumn-update",
            "en"
        );

        expect(loaded.title).toBe(`Spring update - News - ${SITE_NAME}`);
        expect(missing.title).toBe(`autumn update - News - ${SITE_NAME}`);
    });

    it("ignores a post from another category", async () => {
        getContentPostQueryMock.mockResolvedValue(
            newsPost("Bristol meetup", CmsCategory.EVENTS)
        );

        const result = await pageMetaData(
            EntityType.NEWS_ARTICLE,
            "bristol-meetup",
            "en"
        );

        expect(result.title).toBe(`bristol meetup - News - ${SITE_NAME}`);
        await expect(
            loadPageCard(EntityType.NEWS_ARTICLE, "bristol-meetup")
        ).resolves.toBe(undefined);
    });
});
