import { cache } from "react";
import { notFound } from "next/navigation";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import HTMLContent from "@/components/HTMLContent";
import { RouteName } from "@/consts/routeName";
import { getContentPostQuery, hasCategoryName } from "@/utils/cms";
import metaData from "@/utils/metadata";

interface ArticlePageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

const getArticle = cache((slug: string) =>
    getContentPostQuery("getEventsArticle", {
        id: slug,
        idType: "SLUG",
    })
);

export async function generateMetadata({ params }: ArticlePageProps) {
    const { locale, slug } = await params;
    const cmsPost = await getArticle(slug);

    return metaData({
        title: `${cmsPost?.title || slug.replaceAll("-", " ")} - Events`,
        description: cmsPost?.content,
        url: `/${locale}/${RouteName.EVENT_ARTICLE}/${slug}`,
        ogType: "article",
    });
}

const ArticlePage = async ({ params }: ArticlePageProps) => {
    const { slug } = await params;

    const cmsPost = await getArticle(slug);

    if (!cmsPost || !hasCategoryName(cmsPost.categories, "Events")) {
        notFound();
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
