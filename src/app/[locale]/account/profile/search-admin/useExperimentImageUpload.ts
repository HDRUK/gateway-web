"use client";

import { UploadImage } from "@hdruk/experiments/builder";
import { useTranslations } from "next-intl";
import { FileUpload } from "@/interfaces/FileUpload";
import usePost from "@/hooks/usePost";
import apiService from "@/services/api";
import apis from "@/config/apis";

const POLL_INTERVAL = 1000;
const POLL_ATTEMPTS = 60;

const wait = (ms: number) =>
    new Promise(resolve => {
        setTimeout(resolve, ms);
    });

export default function useExperimentImageUpload(): UploadImage {
    const t = useTranslations("api");
    const postFile = usePost<FormData>(
        `${apis.fileUploadV1Url}?entity_flag=experiments-media`,
        { successNotificationsOn: false }
    );

    const poll = async (
        uuid: string,
        attempt = 0
    ): Promise<{ src: string }> => {
        if (attempt >= POLL_ATTEMPTS) {
            throw new Error("Upload timed out");
        }

        await wait(POLL_INTERVAL);

        const status = (await apiService.getRequest<FileUpload>(
            `${apis.fileUploadV1Url}/${uuid}`,
            { notificationOptions: { t, errorNotificationsOn: false } }
        )) as FileUpload | null;

        if (status && status.status === "PROCESSED" && status.url) {
            return { src: status.url };
        }
        if (status && status.status === "FAILED") {
            throw new Error(status.error || "Upload failed");
        }

        return poll(uuid, attempt + 1);
    };

    return async file => {
        const formData = new FormData();
        formData.append("file", file);

        const upload = (await postFile(formData)) as FileUpload | null;

        if (!upload || !upload.uuid) {
            throw new Error("Upload failed");
        }

        return poll(upload.uuid);
    };
}
