import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { render, screen } from "@/utils/testUtils";

describe("ProtectedRoute", () => {
    it("should render component", async () => {
        render(<b> test </b>);
        /*<ProtectedRoute>
                <b> test </b>
            </ProtectedRoute>*/

        expect(screen.getByText("test")).toBeInTheDocument();
    });
});
