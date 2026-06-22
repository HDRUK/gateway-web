import Pagination from "@/components/Pagination";
import { render, fireEvent, screen } from "@/utils/testUtils";

describe("Pagination", () => {
    it("renders without crashing", () => {
        const wrapper = render(<Pagination count={10} onChange={() => null} />);
        expect(wrapper.container).toMatchSnapshot();
    });

    it("calls onChange callback", () => {
        const handleChange = jest.fn();
        const { getByText } = render(
            <Pagination count={10} onChange={handleChange} />
        );

        const pageTwoButton = getByText("2");
        fireEvent.click(pageTwoButton);

        expect(handleChange).toHaveBeenCalledWith(expect.any(Object), 2);
    });

    it("should return empty div if still loading", () => {
        const wrapper = render(
            <Pagination count={10} isLoading onChange={() => null} />
        );

        expect(wrapper.container).toMatchSnapshot();
    });

    it("disables the prev arrow on page 1", () => {
        render(<Pagination count={5} page={1} onChange={() => null} />);
        expect(
            screen.getByRole("button", { name: "Go to previous page" })
        ).toBeDisabled();
    });

    it("disables the next arrow on the last page", () => {
        render(<Pagination count={5} page={5} onChange={() => null} />);
        expect(
            screen.getByRole("button", { name: "Go to next page" })
        ).toBeDisabled();
    });

    it("does not disable prev or next when in the middle of pages", () => {
        render(<Pagination count={5} page={3} onChange={() => null} />);
        expect(
            screen.getByRole("button", { name: "Go to previous page" })
        ).not.toBeDisabled();
        expect(
            screen.getByRole("button", { name: "Go to next page" })
        ).not.toBeDisabled();
    });
});
