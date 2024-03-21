import React from "react";
import NewsSummaryCard from "@/components/NewsSummaryCard";
import { render } from "@/utils/testUtils";

describe("NewsSummaryCard", () => {
    it("should render component", async () => {
        const wrapper = render(
            <NewsSummaryCard
                buttonText="Read more"
                headline="This is a headline"
                summary="Cras ut sem eu ligula tincidunt aliquet. Lorem ipsum dolor sit amet. Nullam maximus risus et pharetra fringill. Suspendisse porttitor tortor et lectus pulvinar"
                date="2023-01-01"
                url="https://www.healthdatagateway.org/"
                imageLink="/images/account/teams/integrations/create.jpg"
                imageAlt="Image alt text"
            />
        );

        expect(wrapper.container).toMatchSnapshot();
    });
});
