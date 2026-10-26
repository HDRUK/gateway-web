import useDialog from "@/hooks/useDialog";
import RevokeAllTokensDialog from "@/modules/RevokeAllTokensDialog";
import { render, screen, fireEvent } from "@/utils/testUtils";
import SessionsTab from "./SessionsTab";

jest.mock("@/hooks/useDialog");

describe("SessionsTab", () => {
    const showDialog = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useDialog as jest.Mock).mockReturnValue({ showDialog });
    });

    it("opens the confirmation dialog rather than revoking directly", () => {
        render(<SessionsTab />);

        fireEvent.click(
            screen.getByRole("button", { name: /revoke all sessions/i })
        );

        expect(showDialog).toHaveBeenCalledWith(RevokeAllTokensDialog);
    });
});
