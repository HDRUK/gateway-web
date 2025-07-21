
import { logger } from "@/utils/logger";
import { NextResponse } from "next/server";

export async function GET() {
  const sessionId = "test-session-123";
  const location = "GET /api/kaboom";

  logger.info("Everything is working fine", sessionId, location);
  logger.warn("This might be a potential issue", sessionId, location);
  logger.error(new Error("Kaboom! Something exploded"), sessionId, location);

  return NextResponse.json({ message: "jam" });
}
