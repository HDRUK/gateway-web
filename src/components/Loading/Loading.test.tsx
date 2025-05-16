import Loading from "@/components/Loading";
import { render } from "@/utils/testUtils";

describe("Loading", () => {
    it("should render component", async () => {
        const wrapper = render(<Loading />);

        expect(wrapper.container).toMatchSnapshot();
    });
    it("should add aria label", async () => {
        const wrapper = render(<Loading ariaLabel="TEST ARIA LABEL" />);

        expect(wrapper.getByText("TEST ARIA LABEL")).toBeInTheDocument();
    });
    it("should default aria label if none passed", async () => {
        const wrapper = render(<Loading />);

        expect(wrapper.getByText("Loading")).toBeInTheDocument();
    });
});
