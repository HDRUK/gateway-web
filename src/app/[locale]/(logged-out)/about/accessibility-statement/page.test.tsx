import { render, screen } from "@/utils/testUtils";
import AccessibilityStatementPage from "./page";

const enFile = jest.requireActual("@/config/messages/en.json");

jest.mock("next-intl/server", () => ({
    getTranslations: () =>
        jest.fn().mockImplementation((stringKey: string) => {
            const collectionsString = `pages.about.accessibilityStatement.${stringKey}`;
            return collectionsString
                .split(".")
                .reduce((result, key) => result[key], enFile);
        }),
}));

describe("AccessibilityStatementPage", () => {
    const originalFetch = global.fetch;

    beforeEach(() => {
        global.fetch = jest.fn() as typeof fetch;
    });

    afterEach(() => {
        jest.resetAllMocks();
        global.fetch = originalFetch;
    });

    it("renders the banner and fetched markdown content", async () => {
        const mockMarkdown = `# Accessibility heading This is the accessibility body text.`;

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            text: jest.fn().mockResolvedValue(mockMarkdown),
        } as unknown as Response);

        const Result = await AccessibilityStatementPage();

        const { container } = render(Result);

        expect(
            screen.getByRole("heading", { name: /Accessibility Statement/i })
        ).toBeInTheDocument();

        expect(
            screen.getByText(/This is the accessibility body text\./i)
        ).toBeInTheDocument();

        expect(global.fetch).toHaveBeenCalledTimes(1);

        expect(container.querySelector("h1")).not.toBeNull();
    });

    it("throws if the fetch fails", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            text: jest.fn().mockResolvedValue(""),
        } as unknown as Response);

        await expect(AccessibilityStatementPage()).rejects.toThrow(
            "Failed to fetch accessibility statement"
        );
    });
});
