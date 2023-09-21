import React from "react";
import HTMLContent from "@/components/HTMLContent";
import { render } from "@/utils/testUtils";

describe("HTMLContent", () => {
    it("should render component", async () => {
        const html =
            "\n<p>This month we are pleased to share improvements to the usability of the search results page. Plus, we release our data use register widget.</p>\n";

        const wrapper = render(<HTMLContent content={html} />);

        expect(wrapper.container).toMatchSnapshot();
    });
});
