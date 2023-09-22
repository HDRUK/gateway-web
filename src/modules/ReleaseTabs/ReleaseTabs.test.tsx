import { fireEvent, render, screen } from "@/utils/testUtils";
import { ReleaseNode } from "@/interfaces/Releases";
import ReleaseTabs from "./ReleaseTabs";

describe("ReleaseTabs", () => {
    it("renders tabs with release content", () => {
        const mockReleases = [
            {
                node: {
                    id: "1",
                    title: "Release 1",
                    date: "2023-01-01",
                    content: "Content for release 1",
                },
            },
            {
                node: {
                    id: "2",
                    title: "Release 2",
                    date: "2022-01-01",
                    content: "Content for release 2",
                },
            },
        ];

        render(<ReleaseTabs allReleases={mockReleases} />);

        const tab2023 = screen.getByText("2023");
        const tab2022 = screen.getByText("2022");

        expect(tab2023).toBeInTheDocument();
        expect(tab2022).toBeInTheDocument();

        fireEvent.click(tab2022);

        const releaseTitle = screen.getByText("Release 2");
        const releaseContent = screen.getByText("Content for release 2");

        expect(releaseTitle).toBeInTheDocument();
        expect(releaseContent).toBeInTheDocument();
    });

    it("displays a message for a year with no releases", () => {
        const mockReleases: ReleaseNode[] = [];
        render(<ReleaseTabs allReleases={mockReleases} />);

        const noReleasesMessage = screen.getByText(
            "There are no releases for 2023"
        );

        expect(noReleasesMessage).toBeInTheDocument();
    });
});
