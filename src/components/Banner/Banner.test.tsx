import React from "react";
import Banner from "@/components/Banner";
import { render, screen } from "@/utils/testUtils";
import Image from "../../../public/images/banners/release-notes.png";

describe("Banner", () => {
    it("should render component", async () => {
        render(
            <Banner title="mock title" subTitle="mock sub title" src={Image} />
        );

        expect(screen.getByAltText("mock title")).toBeInTheDocument();
        expect(screen.getByText("mock title")).toBeInTheDocument();
        expect(screen.getByText("mock sub title")).toBeInTheDocument();
    });
});
