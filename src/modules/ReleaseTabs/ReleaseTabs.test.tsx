import { render, screen } from "@/utils/testUtils";
import { ReleaseNode } from "@/interfaces/Releases";
import ReleaseTabs from "./ReleaseTabs";

jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/",
            pathname: "",
            query: {},
            asPath: "",
        };
    },
}));

jest.mock("next/navigation", () => ({
    useSearchParams() {
        return {
            get: () => "2023",
        };
    },
}));

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

        expect(screen.getByText("Release 1")).toBeInTheDocument();
        expect(screen.getByText("Content for release 1")).toBeInTheDocument();
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
