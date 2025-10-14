import { usePathname, useSearchParams } from "next/navigation";

const useFullPathname = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const fullPath =
        searchParams.toString() === ""
            ? pathname
            : `${pathname}?${searchParams.toString()}`;

    return fullPath;
};

export default useFullPathname;
