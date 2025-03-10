import { Control, useController } from "react-hook-form";
import { FormControl, FormControlLabel, Stack, SxProps } from "@mui/material";
import Input, { InputProps } from "@mui/material/Input";
import Button from "@/components/Button";
import Typography from "@/components/Typography";
import theme, { colors } from "@/config/theme";
import { UploadFileIcon } from "@/consts/icons";

export interface UploadProps extends InputProps {
    label: string;
    name: string;
    control: Control;
    helperText?: string;
    acceptFileTypes?: string;
    uploadSx?: SxProps;
    formControlSx?: SxProps;
    onFileChange?: (file: File) => void;
}

const Upload = (props: UploadProps) => {
    const {
        acceptFileTypes,
        label,
        control,
        name,
        helperText,
        formControlSx,
        uploadSx,
        onFileChange,
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
                        inputProps={{
                            accept: acceptFileTypes,
                        }}
                        id="file-upload"
                        type="file"
                        {...rest}
                        {...fieldProps}
                        inputRef={ref}
                        sx={{ ...uploadSx }}
                        value={value?.fileName}
                        onChange={handleFileUploadChange}
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
                            startIcon={<UploadFileIcon color="primary" />}>
                            {label}
                        </Button>
                        <Typography color={colors.grey600}>
                            {helperText}
                        </Typography>
                    </Stack>
                }
            />
        </FormControl>
    );
};

export default Upload;
