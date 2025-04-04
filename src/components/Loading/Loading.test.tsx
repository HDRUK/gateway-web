import React from "react";
import Loading from "@/components/Loading";
import { render } from "@/utils/testUtils";

describe("Loading", () => {
    it("should render component", async () => {
        const wrapper = render(<Loading />);

        expect(wrapper.container).toMatchSnapshot();
    });
});
