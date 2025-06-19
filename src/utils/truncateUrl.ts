export function truncateUrl(url: string, maxLength = 40): string {
    if (url.length <= maxLength) return url;
    return `${url.slice(0, maxLength - 3)}...`;
}
