import ActionBar from "@/components/ActionBar";

export default async function AccountTeamLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            <ActionBar />
        </>
    );
}
