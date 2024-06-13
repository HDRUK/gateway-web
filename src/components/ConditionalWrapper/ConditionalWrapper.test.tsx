import React, { ReactNode } from "react";
import Link from "@/components//Link";
import ConditionalWrapper from "@/components/ConditionalWrapper";
import { render, screen } from "@/utils/testUtils";

describe("ConditionalWrapper", () => {
    const wrapperFn = (href: string) => (children: ReactNode) => {
        return <Link href={href}>{children}</Link>;
    };
    it("should render with Wrapper", async () => {
        const { container } = render(
            <ConditionalWrapper
                requiresWrapper
                wrapper={wrapperFn("this/is/a/href")}>
                <div>this is child content</div>
            </ConditionalWrapper>
        );

        expect(screen.getByText("this is child content")).toBeInTheDocument();

        const linkElement = container.querySelector("a");
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveAttribute("href", "this/is/a/href");
    });
    it("should render without Wrapper", async () => {
        const { container } = render(
            <ConditionalWrapper
                requiresWrapper={false}
                wrapper={wrapperFn("this/is/a/href")}>
                <div>this is child content</div>
            </ConditionalWrapper>
        );

        expect(screen.getByText("this is child content")).toBeInTheDocument();
        const linkElement = container.querySelector("a");
        expect(linkElement).not.toBeInTheDocument();
    });
});
