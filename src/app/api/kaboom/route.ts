import { NextResponse } from "next/server";
import winston from "winston";


export async function GET() {
const logger = winston.createLogger({
 level: 'info', // Minimum log level
 format: winston.format.json(), // Output format for logs
 transports: [
   new winston.transports.Console(), // Log to the console
 ],
});
logger.log({ level: 'info', message: 'Hello world' });
  return NextResponse.json({ message: "logged" });
}
