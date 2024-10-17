import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { render, screen } from "@/utils/testUtils";
import CollectionItemPage from "./[collectionId]/page";

const enFile = jest.requireActual("@/config/messages/en.json");

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
    getReducedCollection: jest.fn(),
}));

const mockLargeCollection = {
    id: 15,
    name: "Neonatal Data Visualisations",
    description:
        "This tool provides insights into the neonatal health data contained within the National Neonatal Research Database (NNRD). The tools are aimed at parents, clinical teams, researchers and health service managers.  To access our NNRD Interrogation tools, please click here: https://www.imperial.ac.uk/neonatal-data-analysis-unit/neonatal-data-analysis-unit/neonatal-data-visualisations/",
    image_link: null,
    enabled: true,
    public: 1,
    counter: 144,
    created_at: "2024-10-04T12:23:54.000000Z",
    updated_at: "2024-10-04T12:34:14.000000Z",
    deleted_at: null,
    mongo_object_id: "6200fe70f822e606e42f86ca",
    mongo_id: "21617238734209688",
    updated_on: null,
    team_id: null,
    status: "ACTIVE",
    keywords: [
        {
            id: 34,
            name: "NNRD",
            enabled: true,
            created_at: null,
            updated_at: "2024-10-04T12:23:54.000000Z",
            pivot: {
                collection_id: 15,
                keyword_id: 34,
            },
        },
        {
            id: 33,
            name: "neonatal",
            enabled: true,
            created_at: null,
            updated_at: "2024-10-04T12:23:02.000000Z",
            pivot: {
                collection_id: 15,
                keyword_id: 33,
            },
        },
    ],
    tools: [
        {
            id: 148,
            name: "Neonatal Data Visualisations",
            created_at: "2024-10-04T12:23:38.000000Z",
            user_id: 3242,
            pivot: {
                collection_id: 15,
                tool_id: 148,
            },
            user: {
                id: 3242,
                firstname: "Ricardo",
                lastname: "Ribas",
                rquestroles: [],
            },
        },
    ],
    dur: [
        {
            id: 564,
            project_title:
                "Wales Multimorbidity Cohort COVID-19 Surveillance (contains 58 active research projects)",
            organisation_name: "Swansea University",
            pivot: {
                collection_id: 5,
                dur_id: 564,
            },
        },
    ],
    publications: [
        {
            id: 80,
            paper_title:
                "An online decision tree for vaccine efficacy trial design during infectious disease epidemics: The InterVax-Tool.",
            authors:
                "Bellan SE, Eggo RM, Gsell PS, Kucharski AJ, Dean NE, Donohue R, Zook M, Edmunds WJ, Odhiambo F, Longini IM, Brisson M, Mahon BE, Henao-Restrepo AM.",
            url: "https://europepmc.org/articles/PMC6620503",
            year_of_publication: "2019",
            pivot: {
                collection_id: 3,
                publication_id: 80,
            },
        },
    ],
    dataset_versions: [
        {
            id: 142,
            dataset_id: 143,
            shortTitle: "National Neonatal Research Database (NNRD)",
            populationSize: 1200000,
            datasetType: "Health and disease",
            pivot: {
                collection_id: 15,
                dataset_version_id: 142,
            },
        },
        {
            id: 143,
            dataset_id: 144,
            shortTitle:
                "National Neonatal Research Database - Artificial Intelligence (NNRD-AI)",
            populationSize: 1270000,
            datasetType: "Health and disease",
            pivot: {
                collection_id: 15,
                dataset_version_id: 143,
            },
        },
    ],
    team: null,
};

const mockCollection = {
    name: "Test Collection",
    image_link: "https://example.com/image.png",
    description: "This is a test description.",
    tools: [],
    dur: [],
    dataset_versions: [],
    publications: [],
};

describe("CollectionItemPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (cookies as jest.Mock).mockReturnValue({});
    });

    const setup = async (params: { collectionId: string }) => {
        const JSX = await CollectionItemPage({ params });
        render(JSX);
    };

    it("renders the collection page with the data", async () => {
        jest.spyOn(
            require("@/utils/api"),
            "getReducedCollection"
        ).mockResolvedValue(mockCollection);
        await setup({ collectionId: "123" });

        expect(
            await screen.findByText(mockCollection.name)
        ).toBeInTheDocument();
        expect(
            await screen.findByText(mockCollection.description)
        ).toBeInTheDocument();
        expect(await screen.findByText("Description")).toBeInTheDocument();
    });

    it("renders the collection page with with datasets", async () => {
        jest.spyOn(
            require("@/utils/api"),
            "getReducedCollection"
        ).mockResolvedValue(mockLargeCollection);
        await setup({ collectionId: "123" });

        expect(
            await screen.findByText(
                mockLargeCollection.dataset_versions[0].shortTitle
            )
        ).toBeInTheDocument();
    });

    it("calls notFound when collection is not found", async () => {
        // Mock the getReducedCollection to return null
        jest.spyOn(
            require("@/utils/api"),
            "getReducedCollection"
        ).mockResolvedValue(undefined);

        await setup({ collectionId: "123" }).catch(() => {
            expect(notFound).toHaveBeenCalled();
        });
    });
});
