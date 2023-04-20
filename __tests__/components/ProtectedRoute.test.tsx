import React from "react";
import { ProtectedRoute } from "@/components";
import { render } from "../testUtils";

describe("ProtectedRoute", () => {
    it("should render component", async () => {
        const wrapper = render(<ProtectedRoute />);

        expect(wrapper.container).toMatchSnapshot();
    });
});
