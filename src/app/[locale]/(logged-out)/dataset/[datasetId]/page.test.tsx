import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Dataset } from "@/interfaces/Dataset";
import { render, screen } from "@/utils/testUtils";
import { generatePageDataSetV1 } from "@/mocks/data/dataset";
import DatasetItemPage from "./page";

const enFile = jest.requireActual("@/config/messages/en.json");
const getDataSetMock = jest.fn();

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
    getDataset: jest.fn().mockImplementation(() => getDataSetMock()),
}));

const mockDataSet = generatePageDataSetV1();

type DataTestScenariosType = {
    description: string;
    data: Dataset;
};

const dataTestScenarios: DataTestScenariosType[] = [
    {
        description: "a large dataset",
        data: mockDataSet,
    },
];

const mockDataSetWithLinkages = {
    ...mockDataSet,
    versions: [
        {
            ...mockDataSet.versions[0],
            reduced_linked_dataset_versions: [
                {
                    id: "1",
                    name: "Link1",
                    pivot: { linkage_type: "isPartOf" },
                },
                {
                    id: "2",
                    name: "Link2",
                    pivot: { linkage_type: "isPartOf" },
                },
            ],
        },
    ],
};

describe("DataSetItemPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (cookies as jest.Mock).mockReturnValue({});
    });

    const setup = async (params: { datasetId: string }) => {
        const JSX = await DatasetItemPage({ params });
        render(JSX);
    };

    it.each(dataTestScenarios)(
        "renders the dataset page with $description",
        async ({ data }) => {
            getDataSetMock.mockResolvedValue(data);
            await setup({ datasetId: "123" });

            expect(
                await screen.getByText(
                    mockDataSet.versions[0].metadata.metadata.summary.title,
                    { selector: "h2" }
                )
            ).toBeInTheDocument();
        }
    );

    it("renders Linkages component when dataset has linkage data", async () => {
        getDataSetMock.mockResolvedValue(mockDataSetWithLinkages);

        await setup({ datasetId: "123" });

        // Check for linked dataset entries
        expect(screen.getByText("Dataset is part of (2)")).toBeInTheDocument();
    });

    it("hides Linkages component when dataset has no linkage data", async () => {
        getDataSetMock.mockResolvedValue(mockDataSet);

        await setup({ datasetId: "123" });

        // Check for linked dataset entries
        expect(
            screen.queryByText("Dataset is part of (2)")
        ).not.toBeInTheDocument();
    });

    it("calls notFound when dataset is not found", async () => {
        getDataSetMock.mockResolvedValue(null);

        await setup({ datasetId: "123" }).catch(() => {
            expect(notFound).toHaveBeenCalled();
        });
    });
});
