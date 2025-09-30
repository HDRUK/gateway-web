import DarApplicationActionDialog from "@/modules/DarApplicationActionDialog";
import { render, screen, fireEvent } from "@/utils/testUtils";
import TeamTemplates from "./TeamTemplates";

const showDialogMock = jest.fn();
jest.mock("@/hooks/useDialog", () => ({
    __esModule: true,
    default: () => ({ showDialog: showDialogMock }),
}));

const deleteMock = jest.fn().mockResolvedValue(undefined);
jest.mock("@/hooks/useDelete", () => ({
    __esModule: true,
    default: () => deleteMock,
}));

const push = jest.fn();
const replace = jest.fn();
const refresh = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push, replace, refresh }),
    useSearchParams: () => new URLSearchParams("published=1"),
    usePathname: () =>
        "/account/teams/20/data-access-requests/dar-templates/list",
}));

jest.mock("../TemplateList", () => ({
    __esModule: true,
    default: props => {
        const deleteAction = props.actions[props.actions.length - 1];

        return (
            <button
                data-testid="delete-action"
                onClick={() => deleteAction.action(123)}
                type="submit">
                Delete
            </button>
        );
    },
}));

const baseTemplateData = {
    list: [{ id: 111, questions: [] }],
    from: 1,
    to: 1,
    lastPage: 1,
    currentPage: 1,
    total: 1,
};

describe("TeamTemplates", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("opens the delete dialog and the dialog action deletes template", async () => {
        render(
            <TeamTemplates
                permissions={{
                    "data-access-template.update": true,
                    "data-access-template.create": true,
                    "data-access-template.delete": true,
                }}
                teamId="20"
                templateData={baseTemplateData}
                countActive={1}
                countDraft={0}
            />
        );

        fireEvent.click(screen.getByTestId("delete-action"));

        expect(showDialogMock).toHaveBeenCalledTimes(1);
        const [dialogComponent, options] = showDialogMock.mock.calls[0];

        expect(dialogComponent).toBe(DarApplicationActionDialog);
        expect(options).toHaveProperty("action");

        await options.action();

        expect(deleteMock).toHaveBeenCalledWith(123);
        expect(refresh).toHaveBeenCalled();
    });
});
