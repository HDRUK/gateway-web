import React from "react";
import Head from "@/components/Head";
import { render } from "../testUtils";

describe("Head", () => {
    it("should render component", async () => {
        const wrapper = render(<Head title="Mock title" />);

        expect(wrapper.container).toMatchSnapshot();
    });
});
