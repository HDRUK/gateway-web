import NextHead from "next/head";

interface HeadProps {
    title: string;
}

const Head = ({ title }: HeadProps) => {
    return (
        <NextHead>
            <title>{title}</title>
            <meta
                name="description"
                content="The Health Data Research Gateway is a portal enabling researchers and innovators in academia, industry and the NHS to search for and request access to UK health research data."
            />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
        </NextHead>
    );
};

export default Head;
