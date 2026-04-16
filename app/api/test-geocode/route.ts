import { NextResponse } from "next/server";

export async function GET() {
  const address = "Avenida Salvador Allende, 6555, Rio de Janeiro, Brasil";

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  return NextResponse.json(data);
}