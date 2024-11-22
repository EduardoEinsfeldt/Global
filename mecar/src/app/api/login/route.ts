import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const response = await fetch("http://localhost:8080/MeCarJava/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      return NextResponse.json({ message: "Login bem-sucedido!" }, { status: 200 });
    } else {
      const errorData = await response.text();
      return NextResponse.json({ error: `Falha no Login: ${errorData}` }, { status: 400 });
    }
  } catch (error) {
    console.error("Erro durante o Login:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}