export enum ImageValidationError {
    SIZE = "size",
}

export const LogoImage = {
    width: "100%",
    height: "auto",
    maxWidth: 400,
    maxHeight: 400,
    objectFit: "contain",
} as const;
