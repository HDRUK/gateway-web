import { FormHydration } from "@/interfaces/FormHydration";

interface DarQuestion {
    id: number | string;
    boardId: number | string;
    order: number;
    title: string;
    guidance: string;
    original_guidance: string;
    required: number;
    force_required: number;
    allow_guidance_override?: number;
    hasChanged: boolean;
    component: string;
    question_json: FormHydration;
}

interface DarHasQuestion {
    template_id: number;
    question_id: number;
    guidance: string;
    required: number;
    order: number;
    section_id: number;
    force_required: number;
    allow_guidance_override: number;
}

interface DarTemplate {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    team_id: number;
    user_id: number;
    published: number;
    locked: number;
    questions: DarHasQuestion[];
}

export type { DarTemplate, DarQuestion, DarHasQuestion };
