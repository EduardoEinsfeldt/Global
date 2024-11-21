import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const consumptionKwh = searchParams.get("consumptionKwh");

  if (!consumptionKwh) {
    return NextResponse.json(
      { error: "Missing consumptionKwh query parameter" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `http://localhost:8080/MeCarJava/api/energy/calculate?consumptionKwh=${consumptionKwh}`
    );

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    } else {
      const errorData = await response.text();
      return NextResponse.json(
        { error: `Failed to calculate emissions: ${errorData}` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error during emissions calculation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
