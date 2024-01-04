"use client";

import { PageTemplateDefault } from "@/interfaces/Cms";
import HTMLContent from "@/components/HTMLContent";

interface CmsPageContentProps {
    cmsPage: PageTemplateDefault;
}

const CmsPageContent = ({ cmsPage }: CmsPageContentProps) => (
    <HTMLContent content={cmsPage.content} />
);

export default CmsPageContent;
