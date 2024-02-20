import MapUK from "@/components/MapUK";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";

describe("MapUK", () => {
    it("should call handleUpdate with updated values", async () => {
        const mockFn = jest.fn();
        render(<MapUK counts={{}} handleUpdate={mockFn} />);

        await waitFor(() => {
            expect(screen.getByTestId("wales")).toBeInTheDocument();
        });

        const wales = screen.getByTestId("wales");
        fireEvent.click(wales);

        await waitFor(() => {
            expect(mockFn).toHaveBeenCalledWith({
                england: false,
                northernIreland: false,
                scotland: false,
                wales: true,
                world: false,
            });
        });
    });

    it("should display tooltip with name and count", async () => {
        render(<MapUK counts={{ wales: 204 }} />);

        const wales = screen.getByTestId("wales");
        fireEvent.mouseOver(wales);

        await waitFor(() => {
            const title = screen.getByText("204 datasets");
            expect(title).toBeInTheDocument();
        });
    });
});
