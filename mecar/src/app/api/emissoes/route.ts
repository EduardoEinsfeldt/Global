import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { id_emissao, id_tipo_fonte, emissao } = await request.json();

    if (!id_tipo_fonte || !emissao) {
      return NextResponse.json({ error: 'ID do Tipo de Fonte and Emissao are required' }, { status: 400 });
    }

    const response = await fetch("http://localhost:5000/api/emissoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_emissao, tipo_fonte: { id_tipo_fonte }, emissao }),
    });

    if (response.ok) {
      const responseData = await response.json();
      return NextResponse.json(responseData, { status: 201 });
    } else {
      const errorData = await response.text();
      return NextResponse.json({ error: `Falha ao cadastrar Emissao: ${errorData}` }, { status: 400 });
    }
  } catch (error) {
    console.error("Erro durante a requisição ao Flask API:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id_emissao, id_tipo_fonte, emissao } = await request.json();

    if (!id_emissao || !id_tipo_fonte || !emissao) {
      return NextResponse.json({ error: 'ID da Emissao, ID do Tipo de Fonte, and Emissao are required' }, { status: 400 });
    }

    const response = await fetch("http://localhost:5000/api/emissoes", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_emissao, tipo_fonte: { id_tipo_fonte }, emissao }),
    });

    if (response.ok) {
      const responseData = await response.json();
      return NextResponse.json(responseData, { status: 200 });
    } else {
      const errorData = await response.text();
      return NextResponse.json({ error: `Falha ao atualizar Emissao: ${errorData}` }, { status: 400 });
    }
  } catch (error) {
    console.error("Erro durante a requisição ao Flask API:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_emissao = searchParams.get('id_emissao');

    if (!id_emissao) {
      return NextResponse.json({ error: 'ID da Emissao is required' }, { status: 400 });
    }

    const response = await fetch(`http://localhost:5000/api/emissoes/${id_emissao}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return NextResponse.json({ message: "Emissao removida com sucesso!" }, { status: 200 });
    } else {
      const errorData = await response.text();
      return NextResponse.json({ error: `Falha ao remover Emissao: ${errorData}` }, { status: 400 });
    }
  } catch (error) {
    console.error("Erro durante a requisição ao Flask API:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
