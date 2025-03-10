import UploadFile from "@/components/UploadFile";
import { UploadFileProps } from "../UploadFile/UploadFile";

const UploadFileMultiple = (props: UploadFileProps) => {
    return <UploadFile {...props} allowMultipleFiles />;
};

export default UploadFileMultiple;
