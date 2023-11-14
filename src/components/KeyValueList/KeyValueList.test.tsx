import React from "react";
import KeyValueList from "@/components/KeyValueList";
import { render } from "@/utils/testUtils";

describe("KeyValueList", () => {
    it("should render component", async () => {
        const wrapper = render(
            <KeyValueList
                rows={[
                    { key: "one", value: 1 },
                    { key: "two", value: 2 },
                    { key: "three", value: 3 },
                ]}
            />
        );

        expect(wrapper.container).toMatchSnapshot();
    });
});
