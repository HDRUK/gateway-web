import { render, screen, within } from "@/utils/testUtils";
import { generateDataUse } from "@/mocks/data/dataUse";
import { dataUseFields } from "../../config";
import DataUseContent from "./DataUseContent";

const getSafeOutputsSection = () =>
    screen.getByRole("heading", { name: "Safe Outputs" })
        .parentElement as HTMLElement;

describe("DataUseContent", () => {
    it("shows each linked publication under Safe Outputs, linking to its registry page", () => {
        const linkedPublication = {
            id: 3391,
            paper_title: "Linked publication title",
        };

        render(
            <DataUseContent
                data={generateDataUse({ publications: [linkedPublication] })}
                populatedSections={dataUseFields}
            />
        );

        expect(
            within(getSafeOutputsSection()).getByRole("link", {
                name: linkedPublication.paper_title,
            })
        ).toHaveAttribute("href", `/publication/${linkedPublication.id}`);
    });

    it("shows no publications entry when the data use has no linked publications", () => {
        render(
            <DataUseContent
                data={generateDataUse({ publications: [] })}
                populatedSections={dataUseFields}
            />
        );

        expect(
            within(getSafeOutputsSection()).queryByText("Publications")
        ).not.toBeInTheDocument();
    });
});
