import { render } from "@/utils/testUtils";
import EllipsisLineLimit from "./EllipsisLineLimit";

describe("EllipsisLineLimit", () => {
    it("should render component", () => {
        const wrapper = render(
            <EllipsisLineLimit text="Cras ut sem eu ligula tincidunt aliquet. Lorem ipsum dolor sit amet. Nullam maximus risus et pharetra fringill. Suspendisse porttitor tortor et lectus pulvinar" />
        );

        expect(wrapper.container).toMatchSnapshot();
    });
});
