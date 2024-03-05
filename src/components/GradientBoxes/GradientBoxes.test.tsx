import { render } from "@/utils/testUtils";
import GradientBoxes from "./GradientBoxes";

const items = [
    {
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        text: "Vestibulum ultrices purus sit amet cursus gravida. Proin maximus porttitor dui, sed lobortis libero ultrices vitae. In a sem at erat venenatis rhoncus. Morbi at diam sed risus commodo tempus nec ac ligula. Curabitur arcu velit, volutpat in risus sed, suscipit commodo nulla. Aenean luctus feugiat eros at laoreet. Fusce rhoncus augue nec tellus ultrices, et tempor sapien sollicitudin.",
    },
    {
        title: "Vestibulum ultrices purus sit amet cursus gravida. ",
        text: "Proin maximus porttitor dui, sed lobortis libero ultrices vitae. In a sem at erat venenatis rhoncus. Morbi at diam sed risus commodo tempus nec ac ligula. Curabitur arcu velit, volutpat in risus sed, suscipit commodo nulla. Aenean luctus feugiat eros at laoreet. Fusce rhoncus augue nec tellus ultrices, et tempor sapien sollicitudin.",
    },
    {
        title: "Aenean luctus feugiat eros at laoreet.",
        text: "Fusce rhoncus augue nec tellus ultrices, et tempor sapien sollicitudin.",
    },
];

describe("GradientBoxes", () => {
    it("should render title", () => {
        const wrapper = render(<GradientBoxes items={items} />);

        expect(wrapper.container).toMatchSnapshot();
    });
});
