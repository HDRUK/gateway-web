import { notFound } from "next/navigation";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import HTMLContent from "@/components/HTMLContent";
import { getContentPostQuery } from "@/utils/cms";

interface ArticlePageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: ArticlePageProps) {
    return {
        title: `Health Data Research Innovation Gateway - News - ${params.slug.replaceAll(
            "-",
            " "
        )}`,
    };
}

const ArticlePage = async ({ params }: ArticlePageProps) => {
    const cmsPost = await getContentPostQuery("getNewsArticle", {
        id: params.slug,
        idType: "SLUG",
    });

    if (!cmsPost) {
        return notFound();
    }

    return (
        <>
            <Banner
                title={cmsPost.title}
                src="/images/banners/release-notes.png"
            />
            <Container sx={{ padding: 10 }} className="wpStyles">
                {cmsPost?.content && <HTMLContent content={cmsPost?.content} />}
            </Container>
        </>
    );
};

export default ArticlePage;
