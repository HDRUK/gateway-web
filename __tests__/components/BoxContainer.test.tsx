import React from "react";
import BoxContainer from "@/components/BoxContainer";
import { render } from "../testUtils";

describe("BoxContainer", () => {
    it("should render component", async () => {
        const wrapper = render(
            <BoxContainer>BoxContainer content</BoxContainer>
        );

        expect(wrapper.container).toMatchSnapshot();
    });
});
