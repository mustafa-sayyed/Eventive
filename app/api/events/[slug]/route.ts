import { connectDB } from "@/db/db";
import { Event } from "@/db/event.model";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  req: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    await connectDB();
    const { slug } = await params;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { message: "Invalid or missing slug parameter" },
        { status: 400 },
      );
    }

    const sanitizedSlug = slug.trim().toLowerCase();
    const event = await Event.findOne({ slug: sanitizedSlug }).lean();

    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${sanitizedSlug}' not found` },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Event fetched successfully", event },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching events by slug:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
