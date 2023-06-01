import React from "react";
import Label from "@/components/Label";
import { render, screen } from "../testUtils";

describe("Label", () => {
    it("should render label", async () => {
        render(<Label label="This is a label" />);

        expect(screen.getByText("This is a label")).toBeInTheDocument();
    });
    it("should render asterick", async () => {
        const wrapper = render(<Label label="This is a label" required />);

        expect(wrapper.container).toMatchSnapshot();
    });
});
