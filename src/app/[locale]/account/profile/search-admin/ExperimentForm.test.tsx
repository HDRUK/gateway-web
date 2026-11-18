import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import usePut from "@/hooks/usePut";
import apis from "@/config/apis";
import { render, screen } from "@/utils/testUtils";
import { generateExperiment } from "@/mocks/data/experiments";
import ExperimentForm from "./ExperimentForm";

jest.mock("@/hooks/useGet");
jest.mock("@/hooks/usePost");
jest.mock("@/hooks/usePut");

const mockGet = (experiment: object, users: object[] = []) =>
    (useGet as jest.Mock).mockImplementation((url: string) => ({
        data: url.startsWith(apis.usersV1Url) ? users : experiment,
        isLoading: false,
        mutate: jest.fn(),
    }));

describe("ExperimentForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (usePost as jest.Mock).mockReturnValue(jest.fn());
        (usePut as jest.Mock).mockReturnValue(jest.fn());
    });

    it("populates the form with the existing experiment when editing", async () => {
        mockGet(generateExperiment({ id: 3, name: "Onboarding layout" }));

        render(
            <ExperimentForm
                experimentId={3}
                onDone={jest.fn()}
                onCancel={jest.fn()}
            />
        );

        expect(
            await screen.findByDisplayValue("Onboarding layout")
        ).toBeInTheDocument();
        expect(screen.getByText("/en/search")).toBeInTheDocument();
    });

    it("shows targeted users by name rather than ID", async () => {
        mockGet(
            generateExperiment({
                id: 3,
                targeting: {
                    paths: ["/en/search"],
                    audience: "user_ids",
                    user_ids: [5],
                    percentage: 100,
                },
            }),
            [{ id: 5, name: "Jane Doe", email: "j***@example.com" }]
        );

        render(
            <ExperimentForm
                experimentId={3}
                onDone={jest.fn()}
                onCancel={jest.fn()}
            />
        );

        expect(
            await screen.findByText("Jane Doe (j***@example.com)")
        ).toBeInTheDocument();
    });
});
