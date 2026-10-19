import { VersionItem } from "@/interfaces/Dataset";
import { scrollToSection } from "@/utils/dataset";
import { fireEvent, render, screen } from "@/utils/testUtils";
import DatasetStats from "./DatasetStats";

jest.mock("@/utils/dataset", () => ({
    ...jest.requireActual("@/utils/dataset"),
    scrollToSection: jest.fn(),
}));

const data = {
    metadata: {
        metadata: { summary: { populationSize: 1200 } },
    },
} as unknown as Partial<VersionItem>;

const populationCard = () => screen.getAllByRole("button")[0];

describe("DatasetStats", () => {
    beforeEach(() => jest.clearAllMocks());

    it("scrolls to the production page's anchor by default", () => {
        render(<DatasetStats data={data} />);

        fireEvent.click(populationCard());

        expect(scrollToSection).toHaveBeenCalledWith("anchor-Documentation");
    });

    it("scrolls to the anchor scrollTargets maps it to", () => {
        render(
            <DatasetStats
                data={data}
                scrollTargets={{
                    "anchor-Documentation": "mapped-anchor-Documentation",
                }}
            />
        );

        fireEvent.click(populationCard());

        expect(scrollToSection).toHaveBeenCalledWith(
            "mapped-anchor-Documentation"
        );
    });
});
