import { NextResponse } from "next/server";

export async function GET() {
    console.info("hello");
    console.warn("hello");
    console.error("hello");


    return NextResponse.json({ message: "jam" });
}
