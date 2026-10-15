import { render, screen } from "@/utils/testUtils";
import { generateDataCustodianV1 } from "@/mocks/data/dataCustodians/v1";
import ResultCardDataCustodian from "./ResultCardDataCustodian";

describe("ResultCardDataCustodian", () => {
    it("should render the name of the collection", async () => {
        const mockResult = generateDataCustodianV1();

        render(<ResultCardDataCustodian result={mockResult} />);

        expect(screen.getByTestId("grid-chip")).toHaveTextContent(
            mockResult.name
        );
    });
});
