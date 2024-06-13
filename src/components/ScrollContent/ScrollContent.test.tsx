import React from "react";
import ScrollContent from "@/components/ScrollContent";
import { render } from "@/utils/testUtils";

describe("ScrollContent", () => {
    it("should render component", async () => {
        const html =
            "\n<p>This month we are pleased to share improvements to the usability of the search results page. Plus, we release our data use register widget.</p>\n";

        const wrapper = render(<ScrollContent content={html} />);

        expect(wrapper.container).toMatchSnapshot();
    });
});
