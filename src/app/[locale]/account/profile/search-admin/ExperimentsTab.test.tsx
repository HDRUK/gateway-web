import useGet from "@/hooks/useGet";
import { render, screen } from "@/utils/testUtils";
import { generateExperiment } from "@/mocks/data/experiments";
import ExperimentsTab from "./ExperimentsTab";

jest.mock("@/hooks/useGet");

describe("ExperimentsTab", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useGet as jest.Mock).mockReturnValue({
            data: [
                generateExperiment({
                    id: 1,
                    name: "Onboarding layout",
                    status: "active",
                    targeting: {
                        paths: ["/en/account/team/*/datasets/create"],
                        audience: "all",
                        percentage: 100,
                    },
                }),
            ],
            isLoading: false,
            mutate: jest.fn(),
        });
    });

    it("renders each experiment's name, pages and status", () => {
        render(<ExperimentsTab />);

        expect(screen.getByText("Onboarding layout")).toBeInTheDocument();
        expect(
            screen.getByText("/en/account/team/*/datasets/create")
        ).toBeInTheDocument();
        expect(screen.getByText("Active")).toBeInTheDocument();
    });
});
