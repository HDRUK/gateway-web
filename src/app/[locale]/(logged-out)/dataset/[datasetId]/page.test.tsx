import { cookies } from "next/headers";
import { notFound, useRouter } from "next/navigation";
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
    {
        description: "a dataset without linkage data",
        data: {
            ...mockDataSet,
            versions: [
                {
                    ...mockDataSet.versions[0],
                    reduced_linked_dataset_versions: undefined,
                },
            ],
        },
    },
];

describe("DataSetItemPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (cookies as jest.Mock).mockReturnValue({});
        const mockPush = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
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

    it("calls notFound when dataset is not found", async () => {
        getDataSetMock.mockResolvedValue(null);

        await setup({ datasetId: "123" }).catch(() => {
            expect(notFound).toHaveBeenCalled();
        });
    });
});
