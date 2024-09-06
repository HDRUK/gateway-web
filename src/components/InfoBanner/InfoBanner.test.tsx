import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";
import InfoBanner, { InfoBannerProps } from "./InfoBanner";

const defaultInfoBannerProps = {
    ariaCloseButtonLabel: "Close banner",
    message: "Message goes here",
};

const renderInfoBanner = (props: Partial<InfoBannerProps>) =>
    render(<InfoBanner {...defaultInfoBannerProps} {...props} />);

describe("InfoBanner", () => {
    it("dismisses the banner", () => {
        renderInfoBanner({ isDismissable: true });

        const closeButton = screen.getByLabelText("Close banner");

        fireEvent.click(closeButton);

        waitFor(() => {
            expect(
                screen.getByText(defaultInfoBannerProps.message)
            ).not.toBeInTheDocument();
        });
    });

    it("dismisses the banner", () => {
        renderInfoBanner({ isDismissable: true });

        const closeButton = screen.getByLabelText("Close banner");

        fireEvent.click(closeButton);

        waitFor(() => {
            expect(
                screen.getByText(defaultInfoBannerProps.message)
            ).not.toBeInTheDocument();
        });
    });
});
