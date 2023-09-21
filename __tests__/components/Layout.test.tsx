import React from "react";
import PageLayout from "@/components/PageLayout";
import { userV1 } from "@/mocks/data";
import { render, waitFor, screen } from "../testUtils";

describe("PageLayout", () => {
    it("should render component", async () => {
        render(
            <PageLayout>
                <div>content</div>
            </PageLayout>
        );

        await waitFor(() => {
            expect(screen.getByText(userV1.firstname)).toBeInTheDocument();
        });
    });
});
