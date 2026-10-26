import { DataStatus } from "@/consts/application";
import { fireEvent, render, screen, waitFor } from "@/utils/testUtils";
import StatusMenu from "./StatusMenu";

describe("StatusMenu", () => {
    const onChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it.each([
        [DataStatus.ACTIVE, "Active", "MuiChip-filled"],
        [DataStatus.DRAFT, "Draft", "MuiChip-outlined"],
        [DataStatus.ARCHIVED, "Archived", "MuiChip-filled"],
    ])("renders the %s status", (status, label, variantClass) => {
        render(<StatusMenu status={status} onChange={onChange} />);

        const button = screen.getByRole("button", {
            name: `Status: ${label}. Change status`,
        });
        expect(button).toHaveTextContent(label);
        expect(button).toHaveClass(variantClass);
        expect(button).toHaveAttribute("aria-haspopup", "menu");
        expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("opens a menu with the current status checked", () => {
        render(<StatusMenu status={DataStatus.DRAFT} onChange={onChange} />);

        fireEvent.click(screen.getByRole("button"));

        expect(screen.getByRole("button", { hidden: true })).toHaveAttribute(
            "aria-expanded",
            "true"
        );
        expect(
            screen.getByRole("menuitemradio", { name: "Draft" })
        ).toHaveAttribute("aria-checked", "true");
        expect(
            screen.getByRole("menuitemradio", { name: "Active" })
        ).toHaveAttribute("aria-checked", "false");
    });

    it("calls onChange with the selected status", async () => {
        render(<StatusMenu status={DataStatus.DRAFT} onChange={onChange} />);

        fireEvent.click(screen.getByRole("button"));
        fireEvent.click(screen.getByRole("menuitemradio", { name: "Active" }));

        await waitFor(() =>
            expect(onChange).toHaveBeenCalledWith(DataStatus.ACTIVE)
        );
    });

    it("does not call onChange when the current status is selected", () => {
        render(<StatusMenu status={DataStatus.DRAFT} onChange={onChange} />);

        fireEvent.click(screen.getByRole("button"));
        fireEvent.click(screen.getByRole("menuitemradio", { name: "Draft" }));

        expect(onChange).not.toHaveBeenCalled();
    });

    it("lists only the given options", () => {
        render(
            <StatusMenu
                status={DataStatus.DRAFT}
                onChange={onChange}
                options={[DataStatus.DRAFT, DataStatus.ACTIVE]}
            />
        );

        fireEvent.click(screen.getByRole("button"));

        expect(screen.getAllByRole("menuitemradio")).toHaveLength(2);
        expect(
            screen.queryByRole("menuitemradio", { name: "Archived" })
        ).not.toBeInTheDocument();
    });

    it("disables the given options", () => {
        render(
            <StatusMenu
                status={DataStatus.DRAFT}
                onChange={onChange}
                disabledOptions={[DataStatus.ARCHIVED]}
            />
        );

        fireEvent.click(screen.getByRole("button"));

        expect(
            screen.getByRole("menuitemradio", { name: "Archived" })
        ).toHaveAttribute("aria-disabled", "true");
    });
});
