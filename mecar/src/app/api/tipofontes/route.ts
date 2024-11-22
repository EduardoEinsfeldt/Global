import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { nome } = await request.json();

    if (!nome) {
      return NextResponse.json({ error: 'Nome is required' }, { status: 400 });
    }

    const response = await fetch("http://localhost:5000/api/tipofontes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome }),
    });

    if (response.ok) {
      const responseData = await response.json();
      return NextResponse.json(responseData, { status: 201 });
    } else {
      const errorData = await response.text();
      return NextResponse.json({ error: `Falha ao adicionar Tipo de Fonte: ${errorData}` }, { status: 400 });
    }
  } catch (error) {
    console.error("Erro durante a requisição ao Flask API:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const nome = searchParams.get('nome') || '';

    const response = await fetch(`http://localhost:5000/api/tipofontes?nome=${nome}`, {
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
      return NextResponse.json({ error: `Falha ao buscar Tipos de Fonte: ${errorData}` }, { status: 400 });
    }
  } catch (error) {
    console.error("Erro durante a requisição ao Flask API:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id_tipo_fonte, nome } = await request.json();

    if (!id_tipo_fonte || !nome) {
      return NextResponse.json({ error: 'ID and Nome are required' }, { status: 400 });
    }

    const response = await fetch("http://localhost:5000/api/tipofontes", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_tipo_fonte, nome }),
    });

    if (response.ok) {
      const responseData = await response.json();
      return NextResponse.json(responseData, { status: 200 });
    } else {
      const errorData = await response.text();
      return NextResponse.json({ error: `Falha ao atualizar Tipo de Fonte: ${errorData}` }, { status: 400 });
    }
  } catch (error) {
    console.error("Erro durante a requisição ao Flask API:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_tipo_fonte = searchParams.get('id_tipo_fonte');

    if (!id_tipo_fonte) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const response = await fetch(`http://localhost:5000/api/tipofontes/${id_tipo_fonte}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return NextResponse.json({ message: "Tipo de Fonte removido com sucesso!" }, { status: 200 });
    } else {
      const errorData = await response.text();
      return NextResponse.json({ error: `Falha ao remover Tipo de Fonte: ${errorData}` }, { status: 400 });
    }
  } catch (error) {
    console.error("Erro durante a requisição ao Flask API:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
