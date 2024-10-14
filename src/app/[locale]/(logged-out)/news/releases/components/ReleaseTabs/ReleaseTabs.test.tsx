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
        const tab2025 = screen.getByText("2025");

        expect(tab2024).toBeInTheDocument();
        expect(tab2025).toBeInTheDocument();

        expect(
            screen.getByText(mockedReleases[0].node.title)
        ).toBeInTheDocument();
        expect(
            screen.getByText(mockedReleases[0].node.content)
        ).toBeInTheDocument();
    });

    it("displays a message for a year with no releases", () => {
        render(<ReleaseTabs allReleases={[]} />);

        const noReleasesMessage = screen.getByText(
            "There are no releases for 2024"
        );

        expect(noReleasesMessage).toBeInTheDocument();
    });
});
