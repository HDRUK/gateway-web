import { NextRequest, NextResponse } from "next/server";
import { dataset } from "./data";

export async function GET(request: NextRequest, { params }) {
    const id = params.slug;

    const data: any = dataset[id];

    return NextResponse.json(data, { status: 200 });
}
