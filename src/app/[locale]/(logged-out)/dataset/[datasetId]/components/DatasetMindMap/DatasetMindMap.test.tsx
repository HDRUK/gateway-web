import { VersionItem } from "@/interfaces/Dataset";
import { scrollToSection } from "@/utils/dataset";
import { render } from "@/utils/testUtils";
import DatasetMindMap from "./DatasetMindMap";

jest.mock("@/utils/dataset", () => ({
    ...jest.requireActual("@/utils/dataset"),
    scrollToSection: jest.fn(),
}));

type CapturedNode = { id: string; data: { action?: (() => void) | null } };
let capturedNodes: CapturedNode[] = [];

// ReactFlow needs a real layout engine; capture the hydrated nodes instead.
jest.mock("@/components/MindMap/MindMap", () => ({
    __esModule: true,
    default: ({ outerNodes }: { outerNodes: CapturedNode[] }) => {
        capturedNodes = outerNodes;
        return null;
    },
}));

const data = {
    metadata: {
        metadata: {
            summary: { title: "Example", dataCustodian: { name: "Custodian" } },
            structuralMetadata: { tables: [{}], syntheticDataWebLink: [] },
            coverage: {},
        },
    },
} as unknown as VersionItem;

const renderMindMap = (scrollTargets?: Record<string, string>) =>
    render(
        <DatasetMindMap
            data={data}
            teamId={1}
            isCohortDiscovery={false}
            populatedSections={[
                { sectionName: "Structural Metadata", fields: [] },
            ]}
            linkageCounts={{}}
            hasStructuralMetadata
            hasDemographics={false}
            scrollTargets={scrollTargets}
        />
    );

const structuralMetadataAction = () =>
    capturedNodes.find(node => node.data.action)?.data.action;

describe("DatasetMindMap", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        capturedNodes = [];
    });

    it("scrolls to the production page's anchor by default", () => {
        renderMindMap();

        structuralMetadataAction()?.();

        expect(scrollToSection).toHaveBeenCalledWith(
            "anchor-StructuralMetadata"
        );
    });

    it("scrolls to the anchor scrollTargets maps it to", () => {
        renderMindMap({
            "anchor-StructuralMetadata": "mapped-anchor-StructuralMetadata",
        });

        structuralMetadataAction()?.();

        expect(scrollToSection).toHaveBeenCalledWith(
            "mapped-anchor-StructuralMetadata"
        );
    });
});
