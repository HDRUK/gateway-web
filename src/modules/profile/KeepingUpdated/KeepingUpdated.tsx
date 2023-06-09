import Box from "@/components/Box";
import CheckboxRow from "@/components/CheckboxRow/CheckboxRow";
import { profileContactFormFields } from "@/config/forms/profile";
import { Divider, Typography } from "@mui/material";
import { Fragment } from "react";

interface KeepingUpdatedProps {
    control: string;
}

const KeepingUpdated = ({ control }: KeepingUpdatedProps) => {
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
            {profileContactFormFields.map(field => (
                <Fragment key={field.name}>
                    <Divider />
                    <CheckboxRow control={control} {...field} />
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
};

export default KeepingUpdated;
