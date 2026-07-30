import userEvent from "@testing-library/user-event";
import CohortUserDeclaration from "./CohortUserDeclaration";
import { render, screen } from "@/utils/testUtils";

describe("CohortUserDeclaration", () => {
    it("disables Submit until the declaration is agreed", async () => {
        render(
            <CohortUserDeclaration onSubmit={jest.fn()} onCancel={jest.fn()} />
        );

        const submit = screen.getByRole("button", { name: "Submit" });
        expect(submit).toBeDisabled();

        await userEvent.click(screen.getByRole("checkbox"));

        expect(submit).toBeEnabled();
    });

    it("calls onSubmit once agreed and submitted", async () => {
        const onSubmit = jest.fn();
        render(
            <CohortUserDeclaration onSubmit={onSubmit} onCancel={jest.fn()} />
        );

        await userEvent.click(screen.getByRole("checkbox"));
        await userEvent.click(screen.getByRole("button", { name: "Submit" }));

        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it("calls onCancel when cancelled", async () => {
        const onCancel = jest.fn();
        render(
            <CohortUserDeclaration onSubmit={jest.fn()} onCancel={onCancel} />
        );

        await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

        expect(onCancel).toHaveBeenCalledTimes(1);
    });
});
