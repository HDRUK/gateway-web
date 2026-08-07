import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import { generateEmailTemplate } from "@/mocks/data/emailTemplates";
import { render, screen, fireEvent } from "@/utils/testUtils";
import EmailTemplatesTab from "./EmailTemplatesTab";

jest.mock("@/hooks/useGet");
jest.mock("@/hooks/usePatch");

describe("EmailTemplatesTab", () => {
    // Mimics SWR's real mutate() behaviour closely enough for these tests:
    // it invokes the async updater function passed to it (a bare jest.fn()
    // would not, since it never calls its own arguments).
    const mutate = jest.fn((updater: unknown) =>
        typeof updater === "function" ? updater() : Promise.resolve(updater)
    );
    const templates = [
        generateEmailTemplate({
            id: 1,
            identifier: "dar.status.researcher",
            subject: "Your application status has changed",
            enabled: true,
        }),
        generateEmailTemplate({
            id: 2,
            identifier: "dar.submission.custodian",
            subject: "A new application has been submitted",
            enabled: false,
        }),
    ];

    beforeEach(() => {
        jest.clearAllMocks();

        (useGet as jest.Mock).mockReturnValue({
            data: templates,
            isLoading: false,
            mutate,
        });
    });

    it("renders each template's identifier and subject", () => {
        (usePatch as jest.Mock).mockReturnValue(jest.fn());

        render(<EmailTemplatesTab />);

        expect(screen.getByText("dar.status.researcher")).toBeInTheDocument();
        expect(
            screen.getByText("Your application status has changed")
        ).toBeInTheDocument();
        expect(
            screen.getByText("dar.submission.custodian")
        ).toBeInTheDocument();
    });

    it("reflects each template's enabled state in its switch", () => {
        (usePatch as jest.Mock).mockReturnValue(jest.fn());

        render(<EmailTemplatesTab />);

        const enabledSwitch = screen.getByRole("checkbox", {
            name: "Toggle dar.status.researcher enabled",
        });
        const disabledSwitch = screen.getByRole("checkbox", {
            name: "Toggle dar.submission.custodian enabled",
        });

        expect(enabledSwitch).toBeChecked();
        expect(disabledSwitch).not.toBeChecked();
    });

    it("applies an optimistic update and calls the PATCH hook when toggling", async () => {
        const toggle = jest.fn().mockResolvedValue({ id: 1 });
        (usePatch as jest.Mock).mockReturnValue(toggle);

        render(<EmailTemplatesTab />);

        fireEvent.click(
            screen.getByRole("checkbox", {
                name: "Toggle dar.status.researcher enabled",
            })
        );

        // mutate() must be called with optimisticData reflecting the flip
        // immediately (synchronously), before the PATCH request resolves —
        // this is what makes the switch feel instant instead of blocking.
        expect(mutate).toHaveBeenCalledWith(
            expect.any(Function),
            expect.objectContaining({
                optimisticData: [
                    expect.objectContaining({ id: 1, enabled: false }),
                    expect.objectContaining({ id: 2, enabled: false }),
                ],
                revalidate: false,
            })
        );

        await Promise.resolve();
        expect(toggle).toHaveBeenCalledWith(1, { enabled: false });
    });

    it("reverts the optimistic update when the PATCH request fails", async () => {
        const toggle = jest.fn().mockResolvedValue(null);
        (usePatch as jest.Mock).mockReturnValue(toggle);

        render(<EmailTemplatesTab />);

        fireEvent.click(
            screen.getByRole("checkbox", {
                name: "Toggle dar.status.researcher enabled",
            })
        );

        const resolved = await mutate.mock.results[
            mutate.mock.results.length - 1
        ].value;

        expect(resolved).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 1, enabled: true }),
            ])
        );
    });
});
