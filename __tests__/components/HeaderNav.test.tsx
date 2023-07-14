import React from "react";
import HeaderNav from "@/modules/HeaderNav";
import { fireEvent, render, screen, waitFor } from "../testUtils";

describe("HeaderNav", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Component = (props: any) => {
        return <HeaderNav {...props} />;
    };
    it("renders explore navigation items", async () => {
        render(<Component />);

        await waitFor(() => {
            expect(screen.getByText("Explore")).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText("Help")).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText("Usage data")).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText("About us")).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText("News")).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText("Community")).toBeInTheDocument();
        });
    });
    it("On click of nav button, drop down should be visible", async () => {
        render(<Component />);
        await waitFor(() => {
            fireEvent.click(screen.getByText("Explore"));
            expect(screen.getByText("test1")).toBeInTheDocument();
        });
    });
});
