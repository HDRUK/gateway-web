import { FieldError } from "react-hook-form";
import { FormHelperText } from "@mui/material";

interface FormErrorProps {
    error: FieldError | FieldError[];
}

const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
        <FormHelperText sx={{ fontSize: 14 }} error role="alert">
            {message}
        </FormHelperText>
    );
};

const FormError = ({ error }: FormErrorProps) => {
    if (Array.isArray(error)) {
        const messages = error.map(e => e.message);
        const unique = messages.filter((x, i, a) => a.indexOf(x) === i);

        return (
            <>
                {unique.map(message => (
                    <ErrorMessage key={message} message={message} />
                ))}
            </>
        );
    }

    return <ErrorMessage message={error.message} />;
};

export default FormError;
