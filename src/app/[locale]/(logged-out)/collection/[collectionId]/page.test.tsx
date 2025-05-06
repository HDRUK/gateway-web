import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ReducedCollection } from "@/interfaces/Collection";
import { render, screen } from "@/utils/testUtils";
import {
    generateLargeCollectionV1,
    generateBadCollectionV1,
    generateCollectionV1,
} from "@/mocks/data/collections/v1";
import CollectionItemPage from "./page";

const enFile = jest.requireActual("@/config/messages/en.json");
const getReducedCollectionMock = jest.fn();

jest.mock("next-intl/server", () => ({
    getTranslations: () =>
        jest.fn().mockImplementation((stringKey: string) => {
            const collectionsString = `pages.collection.${stringKey}`;
            return collectionsString
                .split(".")
                .reduce((result, key) => result[key], enFile);
        }),
}));

jest.mock("next/navigation", () => ({
    notFound: jest.fn(),
    useSearchParams: jest.fn(),
    usePathname: jest.fn(),
    useRouter: jest.fn(),
}));

jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));

jest.mock("@/utils/api", () => ({
    getReducedCollection: jest
        .fn()
        .mockImplementation(() => getReducedCollectionMock()),
}));

const mockLargeCollection: ReducedCollection = generateLargeCollectionV1();

const mockBadDataSetCollection: ReducedCollection = generateBadCollectionV1();

const mockCollection: ReducedCollection = generateCollectionV1({
    id: 123,
    name: "Test Collection",
    image_link: "https://example.com/image.png",
    description: "This is a test description.",
    tools: [],
    dur: [],
    dataset_versions: [],
    publications: [],
});

type DataTestScenariosType = {
    description: string;
    data: ReducedCollection;
};

const dataTestScenarios: DataTestScenariosType[] = [
    {
        description: "empty array data",
        data: mockCollection,
    },
    {
        description: "null dataset_versions data",
        data: mockBadDataSetCollection,
    },
    {
        description: "large data",
        data: mockLargeCollection,
    },
];

describe("CollectionItemPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (cookies as jest.Mock).mockReturnValue({});
    });

    const setup = async (params: { collectionId: string }) => {
        const JSX = await CollectionItemPage({ params });
        render(JSX);
    };

    it.each(dataTestScenarios)(
        "renders the collection page with $description",
        async ({ data }) => {
            getReducedCollectionMock.mockResolvedValue(data);
            await setup({ collectionId: "123" });

            expect(
                await screen.getByText(data.name, { selector: "h1 > div" })
            ).toBeInTheDocument();
            expect(await screen.findByText("Description")).toBeInTheDocument();
        }
    );

    it("calls notFound when collection is not found", async () => {
        getReducedCollectionMock.mockResolvedValue(null);

        await setup({ collectionId: "123" }).catch(() => {
            expect(notFound).toHaveBeenCalled();
        });
    });
});
