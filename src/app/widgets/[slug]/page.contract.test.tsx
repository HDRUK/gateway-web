import { render, screen } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import Widget from "./page";

const mockHeaders = new Map<string, string>();
const mockIsWidgetsEnabled = jest.fn();
const mockNotFound = jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
});

jest.mock("next/headers", () => ({
    headers: jest.fn(() => Promise.resolve(mockHeaders)),
}));

jest.mock("next/navigation", () => ({
    notFound: () => mockNotFound(),
}));

jest.mock("../../../flags", () => ({
    isWidgetsEnabled: () => mockIsWidgetsEnabled(),
}));

jest.mock("@/components/ThemeRegistry/ThemeRegistry", () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
}));

jest.mock("../../../widgets/WidgetDisplay", () => ({
    __esModule: true,
    default: ({ isIframe }: { isIframe?: boolean }) => (
        <div data-testid="widget-display" data-is-iframe={String(isIframe)} />
    ),
}));

// Mirrors the actual retrieveData payload from gateway-api
const widgetData = {
    datasets: [],
    data_uses: [],
    scripts: [],
    collections: [],
    widget: {
        widget_name: "Contract widget",
        size_width: 400,
        size_height: 592,
        unit: "px",
        include_search_bar: 1,
        include_cohort_link: 1,
        keep_proportions: 0,
    },
};

const renderPage = async (slug = "21-7") => {
    const page = await Widget({ params: Promise.resolve({ slug }) });

    // The page renders a full iframe document; unwrap <html><body> so the
    // content can mount in jsdom.
    expect(page.type).toBe("html");
    const body = page.props.children;
    expect(body.type).toBe("body");

    return render(body.props.children);
};

describe("Widget embed contract: hosted page /widgets/[slug]", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
        mockHeaders.clear();
        mockIsWidgetsEnabled.mockResolvedValue(true);
        mockNotFound.mockClear();
    });

    it("requests widget data as /teams/{teamId}/widgets/{widgetId}/data with the referer origin", async () => {
        mockHeaders.set("referer", "https://embedder.example.com/some/page");
        fetchMock.mockResponseOnce(JSON.stringify({ data: widgetData }));

        await renderPage("21-7");

        expect(fetchMock).toHaveBeenCalledTimes(1);
        const request = fetchMock.mock.calls[0][0] as Request;
        expect(request.url).toBe(
            "http://localhost:8000/api/v1/teams/21/widgets/7/data?domain_origin=https://embedder.example.com"
        );
    });

    it("renders the widget inside the iframe document on success", async () => {
        mockHeaders.set("referer", "https://embedder.example.com/");
        fetchMock.mockResponseOnce(JSON.stringify({ data: widgetData }));

        await renderPage();

        const display = screen.getByTestId("widget-display");
        expect(display).toHaveAttribute("data-is-iframe", "true");
    });

    it("refuses to render without a referer header and does not call the API", async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ data: widgetData }));

        await renderPage();

        expect(
            screen.getByText(
                /cannot be viewed in a browser tab, please view this in the iframe script provided on your website/i
            )
        ).toBeInTheDocument();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("shows the domain-not-permitted message when the API returns 403", async () => {
        mockHeaders.set("referer", "https://not-permitted.example.com/");
        fetchMock.mockResponseOnce("", { status: 403 });

        await renderPage();

        expect(
            screen.getByText(
                /https:\/\/not-permitted\.example\.com is not in the list of permitted domains for this widget/i
            )
        ).toBeInTheDocument();
    });

    it("returns notFound for other API errors", async () => {
        mockHeaders.set("referer", "https://embedder.example.com/");
        fetchMock.mockResponseOnce("", { status: 500 });

        await expect(renderPage()).rejects.toThrow("NEXT_NOT_FOUND");
        expect(mockNotFound).toHaveBeenCalled();
    });

    it("shows the unavailable message when the Widgets feature flag is off", async () => {
        mockIsWidgetsEnabled.mockResolvedValue(false);

        await renderPage();

        expect(
            screen.getByText(/this feature is temporarily unavailable/i)
        ).toBeInTheDocument();
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
