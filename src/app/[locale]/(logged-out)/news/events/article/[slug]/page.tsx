import { notFound } from "next/navigation";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import HTMLContent from "@/components/HTMLContent";
import { getContentPostQuery, hasCategoryName } from "@/utils/cms";
import metaData from "@/utils/metadata";

interface ArticlePageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: ArticlePageProps) {
    const { slug } = await params;

    return metaData({
        title: `${slug.replaceAll("-", " ")} - Events`,
        description: "",
    });
}

const ArticlePage = async ({ params }: ArticlePageProps) => {
    const { slug } = await params;

    const cmsPost = await getContentPostQuery("getEventsArticle", {
        id: slug,
        idType: "SLUG",
    });

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
