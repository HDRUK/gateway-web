import React from "react";
import WPContent from "@/components/WPContent";
import { render } from "../testUtils";

describe("WPContent", () => {
    it("should render component", async () => {
        const html =
            "\n<p>This month we are pleased to share improvements to the usability of the search results page. Plus, we release our data use register widget.</p>\n";

        const wrapper = render(<WPContent content={html} />);

        expect(wrapper.container).toMatchSnapshot();
    });
});
