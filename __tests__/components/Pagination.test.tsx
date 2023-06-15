import { render, fireEvent } from "@testing-library/react";
import Pagination from "@/components/Pagination";

describe("Pagination", () => {
    it("renders without crashing", () => {
        const wrapper = render(
            <Pagination
                count={10}
                variant="outlined"
                shape="rounded"
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onChange={() => {}}
            />
        );
        expect(wrapper.container).toMatchSnapshot();
    });

    it("calls onChange callback", () => {
        const handleChange = jest.fn();
        const { getByText } = render(
            <Pagination
                count={10}
                variant="outlined"
                shape="circular"
                onChange={handleChange}
            />
        );

        const pageTwoButton = getByText("2");
        fireEvent.click(pageTwoButton);

        expect(handleChange).toHaveBeenCalled();
    });
});
