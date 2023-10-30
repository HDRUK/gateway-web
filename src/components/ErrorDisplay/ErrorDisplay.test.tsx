import ErrorDisplay from "@/components/ErrorDisplay";
import { render, screen } from "@/utils/testUtils";

describe("ErrorDisplay", () => {
    it("should render an ErrorDisplay for 401 unauthorised", () => {
        render(<ErrorDisplay variant={401} />);
        expect(
            screen.getByText("You are not authorised to access this page.")
        ).toBeInTheDocument();
    });

    it("should render an ErrorDisplay for 403 forbidden", () => {
        render(<ErrorDisplay variant={403} />);
        expect(
            screen.getByText("You are forbidden to access this page.")
        ).toBeInTheDocument();
    });
});
