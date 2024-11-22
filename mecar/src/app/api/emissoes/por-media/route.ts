import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
      const response = await fetch("http://localhost:5000/api/emissoes/media", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const responseData = await response.json();
        return NextResponse.json(responseData, { status: 200 });
      } else {
        const errorData = await response.text();
        return NextResponse.json({ error: `Falha ao buscar a media das emissoes: ${errorData}` }, { status: 400 });
      }
    } catch (error) {
      console.error("Erro durante a requisição ao Flask API:", error);
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
  }