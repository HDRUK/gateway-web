import React from "react";
import { Footer } from "@/components";
import { render } from "../testUtils";

describe("Footer", () => {
    it("should render component", async () => {
        const wrapper = render(<Footer />);

        expect(wrapper.container).toMatchSnapshot();
    });
});
