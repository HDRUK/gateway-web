import { render, screen } from "@/utils/testUtils";
import { generateDataProviderV1 } from "@/mocks/data/dataProviders/v1";
import ResultCardDataProvider from "./ResultCardDataProvider";

describe("ResultCardDataProvider", () => {
    it("should render the name of the collection", async () => {
        const mockResult = generateDataProviderV1();

        render(
            <ResultCardDataProvider imgUrl="/sample.jpg" result={mockResult} />
        );

        expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
            mockResult.name
        );
    });
});
