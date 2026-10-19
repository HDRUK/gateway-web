import { cookies } from "next/headers";
import { notFound, useRouter } from "next/navigation";
import { Dataset } from "@/interfaces/Dataset";
import { SCHEMA_NAME, SCHEMA_VERSION } from "@/consts/schema";
import { getDataset, getSchemaFromTraser } from "@/utils/api";
import { render } from "@/utils/testUtils";
import {
    generateCrukGwdmDataset,
    generateHdrukGwdmDataset,
} from "@/mocks/data/dataset";
import gwdm20 from "@/mocks/data/dataset/gwdm/schemas/GWDM-2.0.json";
import gwdm21 from "@/mocks/data/dataset/gwdm/schemas/GWDM-2.1.json";
import GwdmDatasetPage from "./GwdmDatasetPage";

jest.mock("next/navigation", () => ({
    notFound: jest.fn(() => {
        throw new Error("NEXT_NOT_FOUND");
    }),
    useSearchParams: jest.fn(),
    usePathname: jest.fn(),
    useRouter: jest.fn(),
}));

jest.mock("next/headers", () => ({ cookies: jest.fn() }));

jest.mock("@/utils/api", () => ({
    getDataset: jest.fn(),
    getSchemaFromTraser: jest.fn(),
}));

const schemas: Record<string, unknown> = { "2.0": gwdm20, "2.1": gwdm21 };

const serve = (dataset: Dataset | undefined) => {
    (getDataset as jest.Mock).mockImplementation(
        (_id: string, model?: string) =>
            Promise.resolve(model === "SchemaOrg" ? undefined : dataset)
    );
    (getSchemaFromTraser as jest.Mock).mockImplementation(
        (_name: string, version: string) =>
            Promise.resolve({ name: "GWDM", version, schema: schemas[version] })
    );
};

const renderPage = async (datasetId = "1") => {
    const JSX = await GwdmDatasetPage({ datasetId });
    return render(JSX);
};

describe("GwdmDatasetPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (cookies as jest.Mock).mockReturnValue({});
        (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    });

    it("requests the dataset as native GWDM, with no schema translation", async () => {
        serve(generateHdrukGwdmDataset());

        await renderPage("42");

        expect(getDataset).toHaveBeenCalledWith("42", undefined, undefined, {
            suppressError: true,
        });
    });

    it("fetches the HDRUK schema for DUO code labels, as the existing page does", async () => {
        serve(generateHdrukGwdmDataset());

        await renderPage();

        expect(getSchemaFromTraser).toHaveBeenCalledWith(
            SCHEMA_NAME,
            SCHEMA_VERSION
        );
    });

    it("fetches the GWDM schema for the dataset's own version from TRASER", async () => {
        serve(generateCrukGwdmDataset());

        await renderPage();

        expect(getSchemaFromTraser).toHaveBeenCalledWith("GWDM", "2.1");
    });

    it("renders an HDRUK dataset with the HDRUK default template", async () => {
        serve(generateHdrukGwdmDataset());

        const { container } = await renderPage();

        expect(
            container.querySelector(
                "[data-template-source='overrides/HDRUK/default/index.mdx']"
            )
        ).not.toBeNull();
    });

    it("renders a CRUK dataset with the CRUK template", async () => {
        serve(generateCrukGwdmDataset());

        const { container } = await renderPage();

        expect(
            container.querySelector(
                "[data-template-source='overrides/CRUK/default/index.mdx']"
            )
        ).not.toBeNull();
    });

    it("returns not found for a missing dataset", async () => {
        serve(undefined);

        await expect(renderPage()).rejects.toThrow("NEXT_NOT_FOUND");
        expect(notFound).toHaveBeenCalled();
    });

    it("returns not found for a dataset that is not active", async () => {
        serve({ ...generateHdrukGwdmDataset(), status: "DRAFT" });

        await expect(renderPage()).rejects.toThrow("NEXT_NOT_FOUND");
    });

    it("still renders when TRASER is unavailable", async () => {
        serve(generateHdrukGwdmDataset());
        (getSchemaFromTraser as jest.Mock).mockRejectedValue(
            new Error("TRASER down")
        );

        const { getByText } = await renderPage();

        expect(getByText("Start a Data Access Request")).toBeInTheDocument();
    });
});
