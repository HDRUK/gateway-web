import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import { templateRepeatFields } from "@/interfaces/Cms";
import { RouteName } from "@/consts/routeName";
import { render, screen, waitFor } from "@/utils/testUtils";
import CohortRequestTermsDialog from "./CohortRequestTermsDialog";

const mockShowDialog = jest.fn();
const mockHideDialog = jest.fn();
let mockDialogProps: {
    cmsContent: templateRepeatFields;
    onSubmitted?: () => void;
};

jest.mock("@/hooks/useDialog", () => ({
    __esModule: true,
    default: () => ({
        showDialog: mockShowDialog,
        hideDialog: mockHideDialog,
        store: { dialogProps: mockDialogProps },
    }),
}));

jest.mock("@/components/Dialog", () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
}));

const cmsContent: templateRepeatFields = {
    title: "T",
    subTitle: "S",
    description: "D",
    contents: [],
};

const acceptAndSubmit = async () => {
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(
        screen.getByRole("button", { name: /accept terms/i })
    );
};

describe("CohortRequestTermsDialog", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRouter.push("/");
    });

    it("closes and calls onSubmitted without opening a follow-up dialog", async () => {
        const onSubmitted = jest.fn();
        mockDialogProps = { cmsContent, onSubmitted };

        render(<CohortRequestTermsDialog />);
        await acceptAndSubmit();

        await waitFor(() => expect(onSubmitted).toHaveBeenCalledTimes(1));
        expect(mockHideDialog).toHaveBeenCalled();
        expect(mockShowDialog).not.toHaveBeenCalled();
    });

    it("navigates to the cohort discovery request page when no onSubmitted is given", async () => {
        mockDialogProps = { cmsContent };

        render(<CohortRequestTermsDialog />);
        await acceptAndSubmit();

        await waitFor(() =>
            expect(mockRouter.asPath).toBe(
                `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.COHORT_DISCOVERY_REQUEST}`
            )
        );
        expect(mockShowDialog).not.toHaveBeenCalled();
    });
});
