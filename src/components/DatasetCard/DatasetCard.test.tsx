import { screen } from "@testing-library/react";
import { Dataset } from "@/interfaces/Dataset";
import { EditIcon } from "@/consts/icons";
import { render } from "@/utils/testUtils";
import DatasetCard from "./DatasetCard";

const baseDataset = {
    id: 1,
    status: "DRAFT",
    updated_at: "2026-01-01T00:00:00Z",
    latest_metadata: {
        gwdmVersion: "2.0",
        summary: { title: "My dataset", publisher: { name: "My Team" } },
        required: { version: "1.0.0" },
    },
} as unknown as Dataset;

const actions = [{ icon: EditIcon, href: "/edit", label: "Edit" }];

describe("DatasetCard", () => {
    // Regression coverage: COLLAB-origin drafts must be editable through the
    // normal dataset management card, same as MANUAL ones - there is no
    // lock, so the admin can activate a collab draft at any time.
    it.each(["MANUAL", "COLLAB"])(
        "shows the normal (editable) actions for a %s-origin dataset",
        create_origin => {
            render(
                <DatasetCard
                    dataset={
                        { ...baseDataset, create_origin } as unknown as Dataset
                    }
                    actions={actions}
                />
            );

            expect(screen.getByLabelText("Edit")).toBeInTheDocument();
        }
    );

    // The admin activates a reviewed collab draft from the card's status
    // menu, the same as a manual draft (activation also revokes its link).
    it.each(["MANUAL", "COLLAB"])(
        "offers the status menu for a %s-origin dataset",
        create_origin => {
            render(
                <DatasetCard
                    dataset={
                        { ...baseDataset, create_origin } as unknown as Dataset
                    }
                    actions={actions}
                    onStatusChange={jest.fn()}
                />
            );

            expect(
                screen.getByRole("button", { name: /status/i })
            ).toBeInTheDocument();
        }
    );

    it.each(["GMI", "API"])(
        "offers no status menu for a %s-origin dataset",
        create_origin => {
            render(
                <DatasetCard
                    dataset={
                        { ...baseDataset, create_origin } as unknown as Dataset
                    }
                    actions={actions}
                    onStatusChange={jest.fn()}
                />
            );

            expect(
                screen.queryByRole("button", { name: /status/i })
            ).not.toBeInTheDocument();
        }
    );

    it("labels how a collab draft was created", () => {
        render(
            <DatasetCard
                dataset={
                    {
                        ...baseDataset,
                        create_origin: "COLLAB",
                    } as unknown as Dataset
                }
                actions={actions}
            />
        );

        expect(
            screen.getByText("Collaborative onboarding")
        ).toBeInTheDocument();
    });

    it.each(["GMI", "API"])(
        "shows the read-only info action for a %s-origin dataset",
        create_origin => {
            render(
                <DatasetCard
                    dataset={
                        { ...baseDataset, create_origin } as unknown as Dataset
                    }
                    actions={actions}
                />
            );

            expect(screen.queryByLabelText("Edit")).not.toBeInTheDocument();
            expect(
                screen.getByLabelText(/Only manually created datasets/i)
            ).toBeInTheDocument();
        }
    );
});
