import { NextRequest, NextResponse } from "next/server";
import { revalidateCache } from "@/utils/revalidateCache";

interface RevalidateRequestBody {
    tags: string | string[];
}

export async function POST(request: NextRequest) {
    try {
        const { tags }: RevalidateRequestBody = await request.json();
        if (!tags || (Array.isArray(tags) && tags.length === 0)) {
            return NextResponse.json(
                { message: "No tags provided" },
                { status: 400 }
            );
        }
        revalidateCache(tags);

        return NextResponse.json(
            {
                message: `Revalidated ${
                    Array.isArray(tags) ? tags.length : 1
                } tag(s) successfully`,
                tags: Array.isArray(tags) ? tags : [tags],
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error revalidating:", error);
        return NextResponse.json(
            {
                message: "Error revalidating",
                error: (error as Error).message,
            },
            { status: 500 }
        );
    }
}
