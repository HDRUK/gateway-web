import ProfileForm from "./ProfileForm";
import { render, screen } from "@/utils/testUtils";

jest.mock("@/hooks/useAuth", () => {
    const user = {
        id: 1,
        firstname: "Jo",
        lastname: "Bloggs",
        email: "jo@example.ac.uk",
        provider: "azure",
        secondary_email: null,
        secondary_email_verified_at: null,
    };
    return { __esModule: true, default: () => ({ user }) };
});

jest.mock("@/hooks/useGet", () => {
    const result = { data: [], isLoading: false };
    return { __esModule: true, default: () => result };
});

jest.mock("@/hooks/usePut", () => ({
    __esModule: true,
    default: () => () => Promise.resolve({}),
}));

jest.mock("@/hooks/usePost", () => ({
    __esModule: true,
    default: () => () => Promise.resolve({}),
}));

jest.mock("@/hooks/useUnsavedChanges", () => ({
    __esModule: true,
    useUnsavedChanges: () => undefined,
}));

const KEEPING_UPDATED_HEADING = "Keeping you updated";

describe("ProfileForm", () => {
    it("renders a custom submit label", () => {
        render(<ProfileForm submitLabel="Save & continue" />);

        expect(
            screen.getByRole("button", { name: "Save & continue" })
        ).toBeInTheDocument();
    });

    it("shows the Keeping updated block by default", () => {
        render(<ProfileForm />);

        expect(
            screen.getByText(KEEPING_UPDATED_HEADING)
        ).toBeInTheDocument();
    });

    it("hides the Keeping updated block when hideKeepingUpdated is set", () => {
        render(<ProfileForm hideKeepingUpdated />);

        expect(
            screen.queryByText(KEEPING_UPDATED_HEADING)
        ).not.toBeInTheDocument();
    });
});
