import { render, screen } from "@/utils/testUtils";
import { generateCollectionV1 } from "@/mocks/data/collections/v1";
import ResultCardCollection from "./ResultCardCollection";

describe("ResultCardCollection", () => {
    it("should render the name of the collection", async () => {
        const mockResult = generateCollectionV1();

        render(<ResultCardCollection result={mockResult} />);

        expect(screen.getByTestId("grid-chip").textContent).toEqual(
            mockResult.name
        );
    });
});
