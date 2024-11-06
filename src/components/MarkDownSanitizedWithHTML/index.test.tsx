import React from "react";
import { render, screen } from "@testing-library/react";
import { MarkDownSanitizedWithHtml, MarkdownWithHtmlProps } from ".";

interface TestCase {
    scenario: string;
    props: MarkdownWithHtmlProps;
    expectedTexts: string[];
    additionalCheck?: () => boolean;
}

const testCases: TestCase[] = [
    {
        scenario: "should render basic markdown content",
        props: { content: "# Howdo\nThis is a markdown test." },
        expectedTexts: ["Howdo", "This is a markdown test."],
    },
    {
        scenario:
            "should render links with target='_blank' and rel='noopener noreferrer' by default",
        props: {
            content: "[Open Link](https://example.com)",
        },
        expectedTexts: ["Open Link"],
        additionalCheck: () =>
            (document.querySelector("a") as HTMLAnchorElement).getAttribute(
                "target"
            ) === "_blank" &&
            (document.querySelector("a") as HTMLAnchorElement).getAttribute(
                "rel"
            ) === "noopener noreferrer",
    },
    {
        scenario:
            "should not render links with target='_blank' and rel='noopener noreferrer' when overrideLinks is false",
        props: {
            content: "[Open Link](https://example.com)",
            overrideLinks: false,
        },
        expectedTexts: ["Open Link"],
        additionalCheck: () =>
            (document.querySelector("a") as HTMLAnchorElement).getAttribute(
                "target"
            ) !== "_blank" &&
            (document.querySelector("a") as HTMLAnchorElement).getAttribute(
                "rel"
            ) !== "noopener noreferrer",
    },
    {
        scenario: "should render with a custom wrapper component",
        props: {
            content: "# Custom Wrapper\nTest",
            wrapper: "section",
        },
        expectedTexts: ["Custom Wrapper", "Test"],
        additionalCheck: () => document.querySelector("section") !== null,
    },
    {
        scenario: "should render with a html",
        props: {
            content: "<div id='biscuit'>custard cream</div>",
            wrapper: "section",
        },
        expectedTexts: ["custard cream"],
        additionalCheck: () => document.getElementById("biscuit") !== null,
    },
];

describe("MarkDownSanitizedWithHtml", () => {
    const setup = (props: MarkdownWithHtmlProps) =>
        render(<MarkDownSanitizedWithHtml {...props} />);

    it.each(testCases)(
        "$scenario",
        async ({ props, expectedTexts, additionalCheck }) => {
            setup(props);

            expectedTexts.forEach(text => {
                expect(screen.getByText(text)).toBeInTheDocument();
            });

            if (additionalCheck) {
                expect(additionalCheck()).toBe(true);
            }
        }
    );
});
