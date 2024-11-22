import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id_tipo_fonte: string } }) {
  try {
    const id_tipo_fonte = params.id_tipo_fonte;

    if (!id_tipo_fonte) {
      return NextResponse.json({ error: 'ID do Tipo de Fonte is required' }, { status: 400 });
    }

    const response = await fetch(`http://localhost:5000/api/emissoes/${id_tipo_fonte}`, {
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
      return NextResponse.json({ error: `Falha ao buscar Emissoes: ${errorData}` }, { status: 400 });
    }
  } catch (error) {
    console.error("Erro durante a requisição ao Flask API:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
