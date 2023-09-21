import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { render } from "@/utils/testUtils";

describe("ProtectedRoute", () => {
    it("should render component", async () => {
        const wrapper = render(<ProtectedRoute />);

        expect(wrapper.container).toMatchSnapshot();
    });
});
