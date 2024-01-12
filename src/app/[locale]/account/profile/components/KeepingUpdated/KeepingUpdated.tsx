import { Fragment } from "react";
import { Control, FieldValues } from "react-hook-form";
import { Divider } from "@mui/material";
import { ComponentTypes } from "@/interfaces/ComponentTypes";
import Box from "@/components/Box";
import InputWrapper from "@/components/InputWrapper";
import Typography from "@/components/Typography";

interface KeepingUpdatedProps<T extends FieldValues> {
    control: Control<T>;
    fields: {
        title: string;
        label: string;
        name: string;
        component: ComponentTypes;
    }[];
}

function KeepingUpdated<T extends FieldValues>({
    control,
    fields,
}: KeepingUpdatedProps<T>) {
    return (
        <Box sx={{ padding: 0 }}>
            <Divider />
            <Typography
                sx={{
                    fontWeight: "bold",
                    paddingTop: 2,
                    paddingBottom: 2,
                }}>
                Keeping you updated
            </Typography>
            {fields.map(field => (
                <Fragment key={field.name}>
                    <Divider />
                    <InputWrapper control={control} {...field} />
                </Fragment>
            ))}

            <Divider />
            <Typography sx={{ marginTop: 2, marginBottom: 4 }}>
                As a user of the Gateway we take the privacy and security of
                your personal data seriously. Our privacy policy aims to give
                you information on how Health Data Research UK collects and
                processes your personal data through your use of this Gateway,
                including any data you may provide by emailing us.
            </Typography>
        </Box>
    );
}

export default KeepingUpdated;
