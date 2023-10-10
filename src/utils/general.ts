import notificationService from "@/services/notification";

const capitalise = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const copyToClipboard = (str: string | undefined) => {
    navigator.clipboard.writeText(
        str || ""
    );

    //note: "Copied to clipboard" would better?
    notificationService.success(
        "Link copied" 
    );
}

export { capitalise, copyToClipboard };
