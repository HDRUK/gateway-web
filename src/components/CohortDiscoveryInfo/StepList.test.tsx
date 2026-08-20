import { CmsStep } from "@/interfaces/Cms";
import StepList from "./StepList";
import { render, screen } from "@/utils/testUtils";

jest.mock("./ViewCohortDatasetsButton", () => ({
    __esModule: true,
    default: ({ nhsSdeOnly }: { nhsSdeOnly?: boolean }) => (
        <button type="button">
            {nhsSdeOnly ? "view datasets nhs" : "view datasets"}
        </button>
    ),
}));

jest.mock("../CohortDiscoveryButton", () => ({
    __esModule: true,
    default: () => <button type="button">apply</button>,
}));

const step = (overrides: Partial<CmsStep> = {}): CmsStep => ({
    stepTitle: "A step",
    stepText: "<p>Step body</p>",
    ...overrides,
});

describe("StepList", () => {
    it("numbers every step when no markers are set", () => {
        render(
            <StepList
                steps={[
                    step({ stepTitle: "First" }),
                    step({ stepTitle: "Second" }),
                    step({ stepTitle: "Third" }),
                ]}
            />
        );

        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("skips email markers when numbering, so numbers stay sequential", () => {
        render(
            <StepList
                steps={[
                    step({ stepTitle: "First" }),
                    step({ stepTitle: "Notification", marker: "email" }),
                    step({ stepTitle: "Second" }),
                ]}
            />
        );

        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.queryByText("3")).not.toBeInTheDocument();
    });

    it("renders an icon instead of a number for an email marker", () => {
        render(
            <StepList
                steps={[step({ stepTitle: "Notification", marker: "email" })]}
            />
        );

        expect(screen.getByTestId("MailOutlineIcon")).toBeInTheDocument();
        expect(screen.queryByText("1")).not.toBeInTheDocument();
    });

    it("treats a single-element array marker the same as a scalar", () => {
        render(
            <StepList
                steps={[step({ stepTitle: "Notification", marker: ["email"] })]}
            />
        );

        expect(screen.getByTestId("MailOutlineIcon")).toBeInTheDocument();
    });

    it("renders step titles and sanitised body content", () => {
        render(
            <StepList
                steps={[
                    step({
                        stepTitle: "Define your cohort",
                        stepText: "<p>Use the query builder</p>",
                    }),
                ]}
            />
        );

        expect(screen.getByText("Define your cohort")).toBeInTheDocument();
        expect(screen.getByText("Use the query builder")).toBeInTheDocument();
    });

    it.each([
        ["viewDatasets", "view datasets"],
        ["viewDatasetsNhs", "view datasets nhs"],
        ["apply", "apply"],
    ])("renders the %s button", (buttonKey, label) => {
        render(<StepList steps={[step({ buttonKey })]} />);

        expect(
            screen.getByRole("button", { name: label })
        ).toBeInTheDocument();
    });

    it("renders no button when buttonKey is omitted", () => {
        render(<StepList steps={[step()]} />);

        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("renders no button for an unknown buttonKey", () => {
        render(<StepList steps={[step({ buttonKey: "viewDatasetsNHS" })]} />);

        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("renders an empty list without throwing", () => {
        render(<StepList steps={[]} />);

        expect(screen.getByRole("list")).toBeEmptyDOMElement();
    });
});
