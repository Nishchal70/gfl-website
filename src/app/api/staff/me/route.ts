import { NextResponse } from "next/server";
import { getSessionStaff } from "@/lib/auth";

export async function GET() {
  const staff = await getSessionStaff();
  return NextResponse.json({ staff });
}
