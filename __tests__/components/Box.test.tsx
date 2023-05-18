import React from "react";
import Box from "@/components/Box";
import { render } from "../testUtils";

describe("Box", () => {
    it("should render component", async () => {
        const wrapper = render(<Box>Box content</Box>);

        expect(wrapper.container).toMatchSnapshot();
    });
});
