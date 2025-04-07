import { ImageValidationError } from "@/consts/image";

export type ImageCheckResult = boolean | ImageValidationError;

export const validateImageDimensions = (
    file: File,
    minWidth = 600,
    minHeight = 300,
    minRatio = 1.5,
    maxRatio = 2.5
): Promise<ImageCheckResult> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = e => {
            const img = new Image();
            img.src = e?.target?.result as string;

            img.onload = () => {
                const { width, height } = img;
                const ratio = width / height;

                if (width < minWidth || height < minHeight) {
                    reject(ImageValidationError.SIZE);
                } else if (ratio < minRatio || ratio > maxRatio) {
                    reject(ImageValidationError.RATIO);
                } else {
                    resolve(true);
                }
            };

            img.onerror = () => reject();
        };

        reader.readAsDataURL(file);
    });
};
