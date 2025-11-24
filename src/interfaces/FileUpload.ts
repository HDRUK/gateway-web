import { StructuralMetadata } from "./Dataset";

interface FileUpload {
    id: number;
    uuid: string;
    created_at: string;
    updated_at: string;
    filename: string;
    file_location: string;
    user_id: number;
    status: string;
    error: string | null;
    entity_type: string | null;
    entity_id: number | null;
    structural_metadata?: StructuralMetadata[] | null;
}

type UploadedFileMetadata = {
    uuid: string;
    filename: string;
};

interface FileUploadFields {
    apiPath: string;
    fileDownloadApiPath: string | undefined;
    allowReuploading: boolean;
    hideUpload: boolean;
    onFileUploaded: (file: FileUpload) => Promise<void>;
    onFileRemove?: (fileId: string) => Promise<void>;
    skipImageValidation: boolean;
}

export type { FileUpload, UploadedFileMetadata, FileUploadFields };
