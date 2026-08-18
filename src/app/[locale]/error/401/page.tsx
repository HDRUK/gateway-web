import ErrorDisplay from "@/components/ErrorDisplay";
import RequireSignIn from "./components/RequireSignIn";

interface Page401Props {
    searchParams: Promise<{ redirect?: string }>;
}

export default async function Page401({ searchParams }: Page401Props) {
    const { redirect } = await searchParams;

    return (
        <>
            {redirect && <RequireSignIn redirectPath={redirect} />}
            <ErrorDisplay variant={401} />
        </>
    );
}
