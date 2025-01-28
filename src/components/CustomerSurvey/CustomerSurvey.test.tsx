import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Cookies from "js-cookie";
import CustomerSurvey from "@/components/CustomerSurvey";
import usePost from "@/hooks/usePost";

jest.mock("@/hooks/usePost", () => jest.fn());
jest.mock("next-intl", () => ({
    useTranslations: jest.fn().mockReturnValue((key: string) => key),
}));

jest.mock("js-cookie", () => ({
    set: jest.fn(),
    get: jest.fn(),
}));

describe("CustomerSurvey", () => {
    const initialCookies = undefined;

    beforeEach(() => {
        Cookies.get.mockReturnValue(initialCookies);
        usePost.mockReturnValue(jest.fn());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("submits the survey and hides the component", async () => {
        const mockHandleSubmit = jest.fn();
        usePost.mockReturnValue(mockHandleSubmit);
        render(<CustomerSurvey hideOnLoad={false} />);

        const firstIcon = screen.getByLabelText("Rating 1");
        fireEvent.click(firstIcon);

        await waitFor(() => {
            expect(mockHandleSubmit).toHaveBeenCalledWith({ score: 1 });
            expect(Cookies.set).toHaveBeenCalledWith(
                "surveySubmitted",
                "1",
                { expires: 30 }
            );
            expect(
                screen.queryByText(
                    /How satisfactory is your experience with the Gateway today?/i
                )
            ).toBeNull();
        });
    });

    it("does not show the survey if feedback is already submitted", () => {
        Cookies.get.mockReturnValue("5");

        render(<CustomerSurvey hideOnLoad={false} />);

        expect(
            screen.queryByText(
                /How satisfactory is your experience with the Gateway today?/i
            )
        ).toBeNull();
    });

    it("sets the cookie and hides the survey when clicked", async () => {
        render(<CustomerSurvey hideOnLoad={false} />);

        Cookies.get.mockReturnValue(initialCookies);

        const firstIcon = screen.getByLabelText("Rating 1");
        fireEvent.click(firstIcon);

        await waitFor(() => {
            expect(
                screen.queryByText(
                    /How satisfactory is your experience with the Gateway today?/i
                )
            ).toBeNull();
            expect(Cookies.set).toHaveBeenCalledWith(
                "surveySubmitted",
                "1",
                { expires: 30 }
            );
        });
    });
});
