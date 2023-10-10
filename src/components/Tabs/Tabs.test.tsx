import React from "react";
import Tabs from "@/components/Tabs";
import { render, screen } from "@/utils/testUtils";

jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/",
            pathname: "",
            query: {},
            asPath: "",
        };
    },
}));

jest.mock("next/navigation", () => ({
    useSearchParams() {
        return {
            get: () => "1",
        };
    },
}));

describe("Tabs", () => {
    const tabs = [
        {
            label: "This is a label 1",
            value: "1",
            content: <div>This is content 1</div>,
        },
        {
            label: "This is a label 2",
            value: "2",
            content: <div>This is content 2</div>,
        },
    ];
    it("should render tab labels and content", async () => {
        render(<Tabs tabs={tabs} />);

        expect(screen.getByText("This is a label 1")).toBeInTheDocument();
        expect(screen.getByText("This is content 1")).toBeInTheDocument();
        expect(screen.getByText("This is a label 2")).toBeInTheDocument();
        expect(screen.queryByText("This is content 2")).not.toBeInTheDocument();
    });
});
