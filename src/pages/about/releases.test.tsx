import React from "react";
import ReleasePage from "@/pages/about/releases";
import { render, screen, waitFor } from "@/utils/testUtils";

jest.mock("next/navigation", () => ({
    useSearchParams() {
        return {
            get: () => "2023",
        };
    },
}));

describe("Releases", () => {
    it("should render contents", async () => {
        render(
            <ReleasePage
                allReleases={[
                    {
                        node: {
                            title: "mock title 1",
                            date: "2023-06-12T15:56:38",
                            id: "1",
                            content:
                                "\n<p>This release we focused on improving the search results page, enhancing graphical interactions on the homepage, and updating the Five Safes data access request application form customisation functionality.</p>\n",
                        },
                    },
                    {
                        node: {
                            title: "mock title 2",
                            date: "2022-06-12T15:56:38",
                            id: "2",
                            content:
                                "\n<p>This release we focused on improving the search results page, enhancing graphical interactions on the homepage, and updating the Five Safes data access request application form customisation functionality.</p>\n",
                        },
                    },
                    {
                        node: {
                            title: "mock title 3",
                            date: "2023-08-12T15:56:38",
                            id: "3",
                            content:
                                "\n<p>This release we focused on improving the search results page, enhancing graphical interactions on the homepage, and updating the Five Safes data access request application form customisation functionality.</p>\n",
                        },
                    },
                ]}
            />
        );

        await waitFor(() => {
            expect(screen.getByText("mock title 1")).toBeInTheDocument();
            expect(screen.queryByText("mock title 2")).not.toBeInTheDocument();
            expect(screen.getByText("mock title 3")).toBeInTheDocument();
        });
    });
});
