import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import UserEvent from "@testing-library/user-event";
import * as yup from "yup";
import Button from "@/components/Button";
import Form from "@/components/Form";
import Select from "@/components/Select";
import { SelectProps } from "@/components/Select/Select";
import { render, screen, waitFor } from "@/utils/testUtils";

const submitFn = jest.fn();

const options = [
    { label: "Red", value: 1 },
    { label: "Green", value: 2 },
    { label: "Blue", value: 3 },
    { label: "Yellow", value: 4 },
];

const optionsWithIcons = [
    { label: "Red", value: 1, icon: SupervisorAccountIcon },
    { label: "Green", value: 2, icon: SupervisorAccountIcon },
    { label: "Blue", value: 3, icon: SupervisorAccountIcon },
    { label: "Yellow", value: 4, icon: AdminPanelSettingsIcon },
];

describe("Select", () => {
    interface ExtendedProps extends Omit<SelectProps, "control"> {
        defaultValues: {
            colour: string | string[];
        };
    }

    const validationSchema = yup
        .object({
            colour: yup.string().required().label("Colour"),
        })
        .required();

    const SelectComponent = ({ defaultValues, ...props }: ExtendedProps) => {
        const { handleSubmit, control } = useForm({
            ...(props.required && { resolver: yupResolver(validationSchema) }),
            defaultValues,
        });

        return (
            <Form onSubmit={handleSubmit(data => submitFn(data))}>
                <Select control={control} {...props} />
                <Button type="submit">Submit</Button>
            </Form>
        );
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render enabled component", async () => {
        render(
            <SelectComponent
                label="Select label"
                options={options}
                defaultValues={{ colour: "" }}
                name="colour"
            />
        );

        expect(screen.getByText("Select label")).toBeInTheDocument();

        UserEvent.click(screen.getAllByRole("combobox")[0]);

        await waitFor(() => {
            expect(screen.getByText(options[0].label)).toBeInTheDocument();
            expect(screen.getByText(options[1].label)).toBeInTheDocument();
            expect(screen.getByText(options[2].label)).toBeInTheDocument();
            expect(screen.getByText(options[3].label)).toBeInTheDocument();
        });

        UserEvent.click(screen.getByText(options[2].label));

        await waitFor(() => {
            expect(screen.getByText("Blue")).toBeInTheDocument();
        });
    });

    it("should render multiple component", async () => {
        render(
            <SelectComponent
                label="Select label"
                options={options}
                name="colour"
                defaultValues={{ colour: [] }}
                multiple
            />
        );

        expect(screen.getByText("Select label")).toBeInTheDocument();

        UserEvent.click(screen.getAllByRole("combobox")[0]);

        await waitFor(() => {
            expect(screen.getByText(options[0].label)).toBeInTheDocument();
            expect(screen.getByText(options[1].label)).toBeInTheDocument();
            expect(screen.getByText(options[2].label)).toBeInTheDocument();
            expect(screen.getByText(options[3].label)).toBeInTheDocument();
        });

        UserEvent.click(screen.getByText(options[1].label));
        UserEvent.click(screen.getByText(options[2].label));

        await waitFor(() => {
            expect(screen.getByText("Green, Blue")).toBeInTheDocument();
        });

        UserEvent.click(screen.getByText("Submit"));

        await waitFor(() => {
            expect(submitFn).toBeCalledWith({ colour: [2, 3] });
        });
    });

    it("should render error if required", async () => {
        render(
            <SelectComponent
                label="Select label"
                options={options}
                defaultValues={{ colour: "" }}
                name="colour"
                required
            />
        );

        expect(screen.getByText("Select label")).toBeInTheDocument();

        UserEvent.click(screen.getByText("Submit"));

        await waitFor(() => {
            expect(
                screen.getByText("Colour is a required field")
            ).toBeInTheDocument();
        });

        UserEvent.click(screen.getAllByRole("combobox")[0]);
        await waitFor(() => {
            UserEvent.click(screen.getByText(options[1].label));
        });
        UserEvent.click(screen.getByText("Submit"));

        await waitFor(() => {
            expect(
                screen.queryByText("Colour is a required field")
            ).not.toBeInTheDocument();
        });
    });

    it("should render info", async () => {
        render(
            <SelectComponent
                label="Select label"
                options={options}
                defaultValues={{ colour: "" }}
                name="colour"
                info="info text"
            />
        );

        expect(screen.getByText("info text")).toBeInTheDocument();
    });

    it("should render disabled", async () => {
        render(
            <SelectComponent
                label="Select label"
                options={options}
                defaultValues={{ colour: "" }}
                name="colour"
                disabled
            />
        );

        expect(screen.getByDisplayValue("")).toBeDisabled();
    });

    it("should render icon", async () => {
        render(
            <SelectComponent
                label="Select label"
                options={options}
                defaultValues={{ colour: "" }}
                name="colour"
                icon={AdminPanelSettingsIcon}
            />
        );

        expect(screen.getByTestId("ArrowDropDownIcon")).toBeInTheDocument();
    });

    it("should render different icons", async () => {
        render(
            <SelectComponent
                label="Select label"
                defaultValues={{ colour: "" }}
                name="colour"
                options={optionsWithIcons}
            />
        );

        UserEvent.click(screen.getAllByRole("combobox")[0]);

        await waitFor(() => {
            expect(screen.getAllByTestId("SupervisorAccountIcon")).toHaveLength(
                3
            );
            expect(
                screen.getAllByTestId("AdminPanelSettingsIcon")
            ).toHaveLength(1);
        });
    });
});
