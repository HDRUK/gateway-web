import React from "react";
import { Loading } from "@/components";
import { render } from "../testUtils";

describe("Loading", () => {
    it("should render component", async () => {
        const wrapper = render(<Loading />);

        expect(wrapper.container).toMatchSnapshot();
    });
});
