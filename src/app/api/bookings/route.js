import { NextResponse } from "next/server";

// Simulated in-memory database storage for capstone demonstration
let bookings = [];

export async function GET() {
  return NextResponse.json({ success: true, data: bookings });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newBooking = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    };
    bookings.push(newBooking);
    return NextResponse.json(
      { success: true, data: newBooking },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Invalid payload" },
      { status: 400 },
    );
  }
}
