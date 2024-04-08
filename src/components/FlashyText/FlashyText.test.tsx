import { render } from "@/utils/testUtils";
import FlashyText from "./FlashyText";

describe("FlashyText", () => {
    it("should render component", () => {
        const wrapper = render(
            <FlashyText text="Cras ut sem eu ligula tincidunt aliquet." />
        );

        expect(wrapper.container).toMatchSnapshot();
    });
});
