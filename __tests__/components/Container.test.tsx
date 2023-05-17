import React from "react";
import Container from "@/components/Container";
import { render } from "../testUtils";

describe("Container", () => {
    it("should render component", async () => {
        const wrapper = render(<Container>Container content</Container>);

        expect(wrapper.container).toMatchSnapshot();
    });
});
