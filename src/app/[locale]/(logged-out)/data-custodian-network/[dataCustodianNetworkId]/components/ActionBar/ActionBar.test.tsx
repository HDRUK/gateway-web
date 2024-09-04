import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { SearchCategory } from "@/interfaces/Search";
import { RouteName } from "@/consts/routeName";
import ActionBar from "./ActionBar";

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("next-intl", () => ({
    useTranslations: jest.fn(),
}));

describe("ActionBar", () => {
    it("renders the BackButton with the correct label", () => {
        const mockT = jest.fn().mockReturnValue("Back to collection results");
        (useTranslations as jest.Mock).mockReturnValue(mockT);
        const mockPush = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

        const { getByText } = render(<ActionBar />);

        const button = getByText("Back to collection results");
        expect(button).toBeInTheDocument();
    });

    it("navigates to the correct route when BackButton is clicked", () => {
        const mockT = jest.fn().mockReturnValue("Back to collection results");
        (useTranslations as jest.Mock).mockReturnValue(mockT);
        const mockPush = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

        const { getByText } = render(<ActionBar />);

        const button = getByText("Back to collection results");
        fireEvent.click(button);

        expect(mockPush).toHaveBeenCalledWith(
            `/${RouteName.SEARCH}?type=${SearchCategory.COLLECTIONS}`
        );
    });
});
