import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`http://localhost:5000/api/emissoes/maior`);
    const responseData = await response.json();
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Erro durante a requisição ao Flask API:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}