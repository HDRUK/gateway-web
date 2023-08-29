import BoxContainer from "@/components/BoxContainer";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import SquareButton from "@/components/SquareButton";
import Link from "next/link";

const links = [
    {
        label: "Create App",
        href: "/account/application",
    },
    {
        label: "Manage App(s)",
        href: "/account/application-list",
    },
];

const AppManagement = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My account - Application Management" />
            <BoxContainer
                sx={{
                    gridTemplateColumns: {
                        mobile: "repeat(1, 1fr)",
                        tablet: "repeat(5, 1fr)",
                    },
                    gap: {
                        mobile: 0,
                        tablet: 1,
                    },
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    textDecoration: "none",
                }}>
                {links.map(link => (
                    <Link key={link.label} href={link.href}>
                        <SquareButton>{link.label}</SquareButton>
                    </Link>
                ))}
            </BoxContainer>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await loadServerSideLocales(locale)),
        },
    };
};

export default AppManagement;
