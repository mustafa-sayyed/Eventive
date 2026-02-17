import { connectDB } from "@/db/db";
import { Event } from "@/db/event.model";
import { connectCloudinary } from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();
    const events = await Event.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ events }, { status: 200 });

  } catch (error) {
    console.error("Error while getting events: ", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();
    const formData = await req.formData();

    let eventsData: Record<string, FormDataEntryValue> | null;
    try {
      eventsData = Object.fromEntries(formData.entries());
    } catch (error) {
      console.error("Error while parsing form data: ", error);
      return NextResponse.json({ message: "Failed to parse form data" }, { status: 400 });
    }

    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ message: "Event Image is required" }, { status: 400 });
    }

    const tags = JSON.parse(formData.get("tags") as string);
    const agenda = JSON.parse(formData.get("agenda") as string);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const cloudinary = await connectCloudinary();
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvent" },
          (error, results) => {
            if (error) return reject(error);

            resolve(results);
          },
        )
        .end(buffer);
    });

    const secureUrl = (uploadResult as { secure_url: string }).secure_url;

    if (!secureUrl) {
      return NextResponse.json({ message: "Failed to upload image" }, { status: 500 });
    }

    if (!eventsData) {
      return NextResponse.json({ message: "Event data is required" }, { status: 400 });
    }

    const events = await Event.create({
      ...eventsData,
      image: secureUrl,
      tags,
      agenda,
    });

    return NextResponse.json({ message: "Event Created Successfully", events }, { status: 201 });
  } catch (error) {
    console.error("Error while creating event: ", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
