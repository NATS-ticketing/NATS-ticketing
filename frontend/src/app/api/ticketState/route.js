import { NextResponse } from "next/server";
import { requestTicketState } from "../../lib/natsClient";

export async function GET(request) {
  const session = request.nextUrl.searchParams.get("session");

  if (!session) {
    return NextResponse.json({ error: "Session is required" }, { status: 400 });
  }

  try {
    const state = await requestTicketState(session);
    return NextResponse.json({ state }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
