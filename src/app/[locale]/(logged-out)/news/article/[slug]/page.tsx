import { notFound } from "next/navigation";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import HTMLContent from "@/components/HTMLContent";
import { EntityType } from "@/consts/application";
import { hasCategoryName } from "@/utils/cms";
import { getNewsArticle, pageMetaData } from "@/utils/pageMetadata";

interface ArticlePageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

export async function generateMetadata({ params }: ArticlePageProps) {
    const { locale, slug } = await params;

    return pageMetaData(EntityType.NEWS_ARTICLE, slug, locale);
}

const ArticlePage = async ({ params }: ArticlePageProps) => {
    const { slug } = await params;

    const cmsPost = await getNewsArticle(slug);

    if (!cmsPost || !hasCategoryName(cmsPost.categories, "News")) {
        notFound();
    }

    return (
        <>
            <Banner title={cmsPost.title} />
            <Container sx={{ padding: 10 }} className="wpStyles">
                {cmsPost?.content && <HTMLContent content={cmsPost?.content} />}
            </Container>
        </>
    );
};

export default ArticlePage;
