import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { consumptionKwh } = await request.json();

    const response = await fetch("http://localhost:8080/MeCarJava/api/energy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ consumptionKwh }),
    });

    if (response.ok) {
      return NextResponse.json(
        { message: "Energy consumption added successfully." },
        { status: 201 }
      );
    } else {
      const errorData = await response.text();
      return NextResponse.json(
        { error: `Failed to add energy consumption: ${errorData}` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error during adding energy consumption:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
