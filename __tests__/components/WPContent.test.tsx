import React from "react";
import WordpressContent from "@/components/WordpressContent";
import { render } from "../testUtils";

describe("WordpressContent", () => {
    it("should render component", async () => {
        const html =
            "\n<p>This month we are pleased to share improvements to the usability of the search results page. Plus, we release our data use register widget.</p>\n";

        const wrapper = render(<WordpressContent content={html} />);

        expect(wrapper.container).toMatchSnapshot();
    });
});
