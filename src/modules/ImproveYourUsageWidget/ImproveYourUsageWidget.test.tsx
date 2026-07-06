import userEvent from "@testing-library/user-event";
import { render, screen } from "@/utils/testUtils";
import ImproveYourUsageWidget from "./ImproveYourUsageWidget";

describe("ImproveYourUsageWidget", () => {
    it("cycles to the next tip and wraps back around", async () => {
        render(<ImproveYourUsageWidget />);

        await userEvent.click(
            screen.getByRole("button", { name: "Next tip" })
        );
        expect(
            screen.getByText(/Provide clear, high-quality metadata/)
        ).toBeInTheDocument();

        await userEvent.click(
            screen.getByRole("button", { name: "Next tip" })
        );
        expect(
            screen.getByText(/Adding demographic metadata/)
        ).toBeInTheDocument();
    });

    it("shows the previous tip when navigating backwards", async () => {
        render(<ImproveYourUsageWidget />);

        await userEvent.click(
            screen.getByRole("button", { name: "Previous tip" })
        );
        expect(
            screen.getByText(/Provide clear, high-quality metadata/)
        ).toBeInTheDocument();
    });
});
