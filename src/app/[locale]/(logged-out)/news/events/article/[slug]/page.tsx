import { notFound } from "next/navigation";
import Banner from "@/components/Banner";
import Container from "@/components/Container";
import HTMLContent from "@/components/HTMLContent";
import { getContentPostQuery, hasCategoryName } from "@/utils/cms";
import metaData from "@/utils/metdata";

interface ArticlePageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: ArticlePageProps) {
    return metaData({
        title: `${params.slug.replaceAll("-", " ")} - Events`,
        description: "",
    });
}

const ArticlePage = async ({ params }: ArticlePageProps) => {
    const cmsPost = await getContentPostQuery("getEventsArticle", {
        id: params.slug,
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
