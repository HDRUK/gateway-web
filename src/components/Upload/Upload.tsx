/** @jsxImportSource @emotion/react */

import { FormControl, SxProps } from "@mui/material";
import Input, { InputProps } from "@mui/material/Input";
import { Control, useController } from "react-hook-form";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useTheme } from "@emotion/react";
import * as styles from "./Upload.styles";

export interface UploadProps extends InputProps {
    label: string;
    name: string;
    control: Control;
    uploadSx?: SxProps;
    formControlSx?: SxProps;
}

const Upload = (props: UploadProps) => {
    const theme = useTheme();
    const { label, control, name, formControlSx, uploadSx, ...rest } = props;

    const {
        field: { ref, ...fieldProps },
        fieldState: { error },
    } = useController({
        name,
        control,
    });
    return (
        <FormControl
            fullWidth
            sx={{ m: 0, mb: 2, ...formControlSx }}
            error={!!error}>
            <Input
                id="file-upload"
                type="file"
                {...rest}
                {...fieldProps}
                inputRef={ref}
                sx={{ ...uploadSx }}
            />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="file-upload">
                <span css={styles.uploadLabel({ theme })}>
                    <UploadFileIcon color="primary" />
                    {label}
                </span>
            </label>
        </FormControl>
    );
};

Upload.defaultProps = {
    uploadSx: {},
    formControlSx: {},
};

export default Upload;
