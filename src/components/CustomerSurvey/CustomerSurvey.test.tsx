import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Cookies from "js-cookie";
import CustomerSurvey from "@/components/CustomerSurvey";
import usePost from "@/hooks/usePost";
import * as dateUtils from "@/utils/date";

jest.mock("@/hooks/usePost", () => jest.fn());
jest.mock("next-intl", () => ({
    useTranslations: jest.fn().mockReturnValue((key: string) => key),
}));

jest.mock("js-cookie", () => ({
    set: jest.fn(),
    get: jest.fn(),
}));

jest.mock("@/utils/date", () => ({
    ...jest.requireActual("@/utils/date"),
    formatDate: jest.fn(() => "01"),
    getToday: jest.fn(() => "2025-01-10T00:00:00Z"),
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
        const mockHandleSubmit = jest.fn().mockResolvedValue({ id: 1 });
        usePost.mockReturnValue(mockHandleSubmit);
        render(<CustomerSurvey hideOnLoad={false} />);

        const firstIcon = screen.getByLabelText("Rating 1");
        fireEvent.click(firstIcon);

        await waitFor(() => {
            expect(mockHandleSubmit).toHaveBeenCalledWith({ score: 1 });
            expect(Cookies.set).toHaveBeenCalledWith(
                "surveySession",
                '{"score":1,"id":1}',
                {
                    expires: 90,
                }
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
        const mockHandleSubmit = jest.fn().mockResolvedValue({ id: 1 });
        usePost.mockReturnValue(mockHandleSubmit);
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
                "surveySession",
                '{"score":1,"id":1}',
                {
                    expires: 90,
                }
            );
        });
    });

    it("does not show the survey when the current month is invalid", async () => {
        jest.spyOn(dateUtils, "formatDate").mockReturnValue("02");
        jest.spyOn(dateUtils, "getToday").mockReturnValue(
            "2025-02-10T00:00:00Z"
        );

        render(<CustomerSurvey hideOnLoad={false} />);

        expect(
            screen.queryByText(
                /How satisfactory is your experience with the Gateway today?/i
            )
        ).toBeNull();

        expect(screen.queryByLabelText("Rating 1")).toBeNull();
    });

    it("shows the survey when the current month is valid", async () => {
        jest.spyOn(dateUtils, "formatDate").mockReturnValue("01");
        jest.spyOn(dateUtils, "getToday").mockReturnValue(
            "2025-01-10T00:00:00Z"
        );

        render(<CustomerSurvey hideOnLoad={false} />);

        expect(screen.getByText("title")).toBeInTheDocument();

        expect(screen.queryByLabelText("Rating 1")).toBeInTheDocument();
    });
});
