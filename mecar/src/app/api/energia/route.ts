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
        { message: "Consumo de energia adicionado com sucesso." },
        { status: 201 }
      );
    } else {
      const errorData = await response.text();
      return NextResponse.json(
        { error: `Falha em adicionar o consumo de energia: ${errorData}` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Erro ao tentar adicionar consumo de energia:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
