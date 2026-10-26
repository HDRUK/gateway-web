import { render, screen } from "@/utils/testUtils";
import GwdmSources from "./GwdmSources";

const props = {
    datasetTypes: ["Health and disease", "Registry"],
    datasetSubTypes: ["Cancer"],
    custodianName: "Example Data Custodian",
    collectionSituations: ["COMMUNITY"],
};

describe("GwdmSources", () => {
    it("renders the GWDM source facts with the production labels", () => {
        render(<GwdmSources {...props} />);

        expect(screen.getByText("Dataset Types:")).toBeInTheDocument();
        expect(
            screen.getByText(/Health and disease, Registry/)
        ).toBeInTheDocument();
        expect(screen.getByText(/Cancer/)).toBeInTheDocument();
        expect(screen.getByText(/Example Data Custodian/)).toBeInTheDocument();
        expect(screen.getByText(/COMMUNITY/)).toBeInTheDocument();
        // GWDM is internal; partner schemas are the ingestion standard.
        expect(screen.queryByText(/Schema Version/)).not.toBeInTheDocument();
    });

    it("renders without crashing when GWDM has no type or origin data", () => {
        // The production Sources destructures provenance.origin.datasetType,
        // which GWDM does not have - the CRUK fixture has neither.
        render(
            <GwdmSources
                datasetTypes={[]}
                datasetSubTypes={[]}
                collectionSituations={[]}
            />
        );

        expect(
            screen.getByText("No collection sources listed")
        ).toBeInTheDocument();
        expect(
            screen.queryByText("Dataset Sub-types:")
        ).not.toBeInTheDocument();
        expect(screen.queryByText("Data Custodian:")).not.toBeInTheDocument();
    });
});
