import React from "react";
import ShowingXofX from "@/components/ShowingXofX";
import { render } from "@/utils/testUtils";

describe("ShowingXofX", () => {
    it("should render component", async () => {
        const { container } = render(
            <ShowingXofX from={1} to={5} total={25} />
        );

        expect(container).toHaveTextContent("Showing 1-5 of 25");
    });
});
