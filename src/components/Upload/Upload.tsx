import { Control, useController } from "react-hook-form";
import { FormControl, FormControlLabel, Stack, SxProps } from "@mui/material";
import Input, { InputProps } from "@mui/material/Input";
import { visuallyHidden } from "@mui/utils";
import theme from "@/config/theme";
import { UploadFileIcon } from "@/consts/icons";
import Button from "../Button";

export interface UploadProps extends InputProps {
    label: string;
    name: string;
    control: Control;
    acceptFileTypes?: string;
    formControlSx?: SxProps;
    onFileChange?: (file: File) => void;
    onFocus?: () => void;
}

const Upload = (props: UploadProps) => {
    const {
        acceptFileTypes,
        label,
        control,
        name,
        formControlSx,
        onFileChange,
        onFocus,
        ...rest
    } = props;

    const {
        field: { ref, value, onChange, ...fieldProps },
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }

        const uploadedFile = e.target.files[0];

        onChange(uploadedFile);

        if (onFileChange) {
            onFileChange(uploadedFile);
        }
    };

    return (
        <FormControl
            sx={{ m: 0, mb: 2, ...formControlSx, display: "inline" }}
            error={!!error}>
            <FormControlLabel
                control={
                    <Input
                        aria-label={label}
                        inputProps={{
                            accept: acceptFileTypes,
                        }}
                        type="file"
                        {...rest}
                        {...fieldProps}
                        inputRef={ref}
                        sx={visuallyHidden}
                        value={value?.fileName}
                        onChange={handleFileUploadChange}
                        onFocus={() => onFocus && onFocus()}
                        id={name}
                    />
                }
                label={
                    <Stack
                        spacing={2}
                        sx={{ p: 1, pl: 1.5 }}
                        direction="row"
                        alignItems="center">
                        <Button
                            color="secondary"
                            variant="contained"
                            sx={{
                                pointerEvents: "none",
                                backgroundColor: theme.palette.grey[200],
                            }}
                            startIcon={<UploadFileIcon color="primary" />}
                            tabIndex={-1}>
                            {label}
                        </Button>
                    </Stack>
                }
                disableTypography
            />
        </FormControl>
    );
};

export default Upload;
