import React from "react";
import LogoSlider from "@/components/LogoSlider";
import { render } from "@/utils/testUtils";

describe("LogoSlider", () => {
    it("should render component", async () => {
        const wrapper = render(
            <LogoSlider
                logos={[
                    {
                        alt: "Microsoft",
                        imageSrc: "/images/logos/microsoft-logo.png",
                        websiteUrl: "http://www.google.com",
                    },
                    {
                        alt: "LinkedIn",
                        imageSrc: "/images/logos/linkedIn-logo.png",
                        websiteUrl: "http://www.google.com",
                    },
                    {
                        alt: "Google",
                        imageSrc: "/images/logos/google-logo.png",
                        websiteUrl: "http://www.google.com",
                    },
                ]}
            />
        );

        expect(wrapper.container).toMatchSnapshot();
    });
});
