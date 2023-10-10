import notificationService from "@/services/notification";

const capitalise = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const copyToClipboard = (str: string) => {
    navigator.clipboard.writeText(
        str || ""
    );
    notificationService.success(
        "Link copied"
    );
}

export { capitalise, copyToClipboard };
