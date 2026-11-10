import usePost from "@/hooks/usePost";
import useLogout from "@/hooks/useLogout";
import { render, screen, fireEvent, waitFor } from "@/utils/testUtils";
import RevokeAllTokensDialog from "./RevokeAllTokensDialog";

jest.mock("@/hooks/usePost");
jest.mock("@/hooks/useLogout");
jest.mock("@/services/notification");

describe("RevokeAllTokensDialog", () => {
    const logout = jest.fn().mockResolvedValue(undefined);

    beforeEach(() => {
        jest.clearAllMocks();
        (useLogout as jest.Mock).mockReturnValue(logout);
    });

    it("warns that everyone, including the admin, will be signed out", () => {
        (usePost as jest.Mock).mockReturnValue(jest.fn());

        render(<RevokeAllTokensDialog />);

        expect(
            screen.getByText(/every user will be signed out/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/this includes you/i)).toBeInTheDocument();
    });

    it("keeps the confirm button disabled until the warning is acknowledged", () => {
        (usePost as jest.Mock).mockReturnValue(jest.fn());

        render(<RevokeAllTokensDialog />);

        const confirmButton = screen.getByRole("button", {
            name: /sign everyone out/i,
        });
        expect(confirmButton).toBeDisabled();

        fireEvent.click(screen.getByRole("checkbox"));

        expect(confirmButton).toBeEnabled();
    });

    it("revokes all tokens and then signs the admin out", async () => {
        const revokeAll = jest
            .fn()
            .mockResolvedValue({ revoked_before: "2026-10-26T12:00:00Z" });
        (usePost as jest.Mock).mockReturnValue(revokeAll);

        render(<RevokeAllTokensDialog />);

        fireEvent.click(screen.getByRole("checkbox"));
        fireEvent.click(
            screen.getByRole("button", { name: /sign everyone out/i })
        );

        await waitFor(() => {
            expect(revokeAll).toHaveBeenCalledTimes(1);
        });
        await waitFor(() => {
            expect(logout).toHaveBeenCalledTimes(1);
        });
    });

    it("does not sign the admin out if the revoke request fails", async () => {
        const revokeAll = jest.fn().mockResolvedValue(undefined);
        (usePost as jest.Mock).mockReturnValue(revokeAll);

        render(<RevokeAllTokensDialog />);

        fireEvent.click(screen.getByRole("checkbox"));
        fireEvent.click(
            screen.getByRole("button", { name: /sign everyone out/i })
        );

        await waitFor(() => {
            expect(revokeAll).toHaveBeenCalledTimes(1);
        });
        expect(logout).not.toHaveBeenCalled();
    });

    it("does nothing when cancelled", () => {
        const revokeAll = jest.fn();
        (usePost as jest.Mock).mockReturnValue(revokeAll);

        render(<RevokeAllTokensDialog />);

        fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

        expect(revokeAll).not.toHaveBeenCalled();
        expect(logout).not.toHaveBeenCalled();
    });
});
