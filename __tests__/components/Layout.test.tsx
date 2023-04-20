import React from "react";
import Layout from "@/components/Layout";
import { render, waitFor, screen } from "../testUtils";

describe("Layout", () => {
    it("should render component", async () => {
        const wrapper = render(
            <Layout>
                <div>content</div>
            </Layout>
        );

        await waitFor(() => {
            expect(screen.getByText("My Account")).toBeInTheDocument();
        });

        expect(wrapper.container).toMatchSnapshot();
    });
});
