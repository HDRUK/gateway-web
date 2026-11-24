import { PageTemplateDefault } from "@/interfaces/Cms";

interface Partner {
    title: string;
    description: string;
    image?: {
        node: {
            sourceUrl: string;
            altText: string;
        };
    } | null;
}

interface PartnersPage extends PageTemplateDefault {
    partners?: {
        partnerList?: Partner[] | null;
    } | null;
}

export type { Partner, PartnersPage };
