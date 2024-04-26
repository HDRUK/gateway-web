import { render, screen } from "@/utils/testUtils";
import { generateCollectionV1 } from "@/mocks/data/collections/v1";
import ResultCardCollection from "./ResultCardCollection";

describe("ResultCard", () => {
    it("should render `not reported` when no population", async () => {
        const mockResult = generateCollectionV1();

        render(<ResultCardCollection result={mockResult} />);

        expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
            // eslint-disable-next-line no-underscore-dangle
            mockResult._source.name
        );
    });
});
