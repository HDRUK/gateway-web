import ErrorDisplay from "@/components/ErrorDisplay";
import { render, screen } from "@/utils/testUtils";

describe("ErrorDisplay", () => {
    it("renders an ErrorDisplay for 401 unauthorised", () => {
        render(<ErrorDisplay variant={401} />);
        expect(
            screen.getByText("You do not have access to this page")
        ).toBeInTheDocument();
    });

    it("renders an ErrorDisplay for 403 forbidden", () => {
        render(<ErrorDisplay variant={403} />);
        expect(
            screen.getByText(
                "Permission denied. You do not have access to this page"
            )
        ).toBeInTheDocument();
    });

    it("renders an ErrorDisplay for 404 not found", () => {
        render(<ErrorDisplay variant={404} />);
        expect(
            screen.getByText(
                "Oops! We tried but couldn’t find the page you were looking for"
            )
        ).toBeInTheDocument();
    });

    it("renders an ErrorDisplay for 423 locked", () => {
        render(<ErrorDisplay variant={423} />);
        expect(
            screen.getByText("This page is currently locked")
        ).toBeInTheDocument();
    });

    it("renders an ErrorDisplay for 500 forbidden", () => {
        render(<ErrorDisplay variant={500} />);
        expect(
            screen.getByText(
                "Uh oh, our internal server has experienced an error, feel free to message us if the problem persists"
            )
        ).toBeInTheDocument();
    });
});
