import React from "react";
import { render } from "@/utils/testUtils";
import EmailNotificationDescriptions from "./EmailNotificationDescriptions";

describe("EmailNotificationDescriptions", () => {
    it("should render component", async () => {
        const wrapper = render(<EmailNotificationDescriptions />);

        expect(wrapper.container).toMatchSnapshot();
    });
});
