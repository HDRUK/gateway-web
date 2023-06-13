import React from "react";
import Layout from "@/components/Layout";
import { userV1 } from "@/mocks/data";
import { render, waitFor, screen } from "../testUtils";

describe("Layout", () => {
    it("should render component", async () => {
        render(
            <Layout>
                <div>content</div>
            </Layout>
        );

        await waitFor(() => {
            expect(screen.getByText(userV1.firstname)).toBeInTheDocument();
        });
    });
});
