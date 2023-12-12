import React from "react";
import EmailNotificationDescriptions from "@/modules/EmailNotifications/EmailNotificationDescriptions";
import { render } from "@/utils/testUtils";

describe("EmailNotificationDescriptions", () => {
    it("should render component", async () => {
        const wrapper = render(<EmailNotificationDescriptions />);

        expect(wrapper.container).toMatchSnapshot();
    });
});
