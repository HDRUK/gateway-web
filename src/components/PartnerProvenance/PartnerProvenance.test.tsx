import { render, screen } from "@/utils/testUtils";
import PartnerProvenance from "./PartnerProvenance";

describe("PartnerProvenance", () => {
    it("names the partner a record came from", () => {
        render(<PartnerProvenance partnerName="Cancer Research UK" />);

        expect(screen.getByText(/via/)).toBeInTheDocument();
        expect(screen.getByText("Cancer Research UK")).toBeInTheDocument();
    });

    /**
     * The API omits the name for this deployment's own context, so every
     * HDRUK result on an HDRUK deployment would otherwise carry a line that
     * tells the user nothing.
     */
    it.each([[undefined], [null], [""]])(
        "renders nothing when the name is %p",
        name => {
            const { container } = render(
                <PartnerProvenance partnerName={name} />
            );

            expect(container).toBeEmptyDOMElement();
        }
    );
});
