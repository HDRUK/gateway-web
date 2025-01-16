import { ReleaseNode } from "@/interfaces/Releases";
import { render, screen } from "@/utils/testUtils";
import { generateReleaseNode } from "@/mocks/data/cms";
import ReleaseTabs from "./ReleaseTabs";

jest.mock("next/navigation", () => ({
    ...jest.requireActual("next/navigation"),
    useSearchParams() {
        return {
            get: () => "2024",
            entries: () => "",
        };
    },
}));

jest.useFakeTimers().setSystemTime(new Date("2024-01-01"));

const mockedReleases: ReleaseNode[] = [
    generateReleaseNode("2024-01-01", "1"),
    generateReleaseNode("2024-01-02", "2"),
    generateReleaseNode("2025-01-03", "3"),
];

describe("ReleaseTabs", () => {
    it("renders tabs with release content", () => {
        render(<ReleaseTabs allReleases={mockedReleases} />);

        const tab2024 = screen.getByText("2024");

        expect(tab2024).toBeInTheDocument();

        expect(
            screen.getByText(mockedReleases[0].node.title)
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockedReleases[0].node.content)
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockedReleases[1].node.title)
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockedReleases[1].node.content)
        ).toBeInTheDocument();

        const tab2025 = screen.getByText("2025");

        expect(tab2025).toBeInTheDocument();

        expect(
            screen.getByText(mockedReleases[2].node.title)
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockedReleases[2].node.content)
        ).toBeInTheDocument();
    });

    it("doesn't render a tab for next year unless there is release content", () => {
        render(<ReleaseTabs allReleases={mockedReleases.slice(0, 2)} />);

        const tab2024 = screen.getByText("2024");

        expect(tab2024).toBeInTheDocument();

        expect(
            screen.getByText(mockedReleases[0].node.title)
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockedReleases[0].node.content)
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockedReleases[1].node.title)
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockedReleases[1].node.content)
        ).toBeInTheDocument();

        const tab2025 = screen.getByText("2025");

        expect(tab2025).not.toBeInTheDocument();

        expect(
            screen.getByText(mockedReleases[2].node.title)
        ).not.toBeInTheDocument();
        expect(
            screen.getByText(mockedReleases[2].node.content)
        ).not.toBeInTheDocument();
    });

    it("displays a message for a year with no releases", () => {
        render(<ReleaseTabs allReleases={[]} />);

        const noReleasesMessage = screen.getByText(
            "There are no releases for 2024"
        );

        expect(noReleasesMessage).toBeInTheDocument();
    });
});
