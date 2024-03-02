import Header from "@/components/Header";

export default async function LoggedOutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main>{children}</main>
        </>
    );
}
