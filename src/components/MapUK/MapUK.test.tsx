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
                England: false,
                "Northern Ireland": false,
                Scotland: false,
                Wales: true,
                "Rest of the world": false,
            });
        });
    });

    it("should display tooltip with name and count", async () => {
        render(<MapUK counts={{ Wales: 204 }} />);

        const wales = screen.getByTestId("Wales");
        fireEvent.mouseOver(wales);

        await waitFor(() => {
            const title = screen.getByText("Wales - 204 datasets");
            expect(title).toBeInTheDocument();
        });
    });
});
