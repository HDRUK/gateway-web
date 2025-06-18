import MapUK from "@/components/MapUK";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";

describe("MapUK", () => {
    it("should call handleUpdate with updated values", async () => {
        const mockFn = jest.fn();
        render(<MapUK counts={{}} handleUpdate={mockFn} />);

        await waitFor(() => {
            expect(screen.getByTestId("Wales")).toBeInTheDocument();
        });

        const wales = screen.getByTestId("Wales");
        fireEvent.click(wales);

        await waitFor(() => {
            expect(mockFn).toHaveBeenCalledWith({
                Wales: true,
            });
        });
    });

    it("should display tooltip with name and count", async () => {
        render(<MapUK counts={{ Wales: 204 }} />);

        const wales = screen.getByTestId("Wales");
        fireEvent.mouseOver(wales);

        const title = await screen.findByText(
            "Wales - 204 datasets",
            {},
            { timeout: 2000 }
        );
        expect(title).toBeInTheDocument();
    });
});
