"use client";

import { useState, useEffect } from "react";
import { TipoFonte, Emissao, Estatisticas } from "@/types";

export default function MediasPage() {
  const [tiposFonte, setTiposFonte] = useState<TipoFonte[]>([]);
  const [emissoes, setEmissoes] = useState<Emissao[]>([]);
  const [novoNomeFonte, setNovoNomeFonte] = useState<string>("");
  const [novaEmissao, setNovaEmissao] = useState<{ idTipoFonte: string; emissao: string }>({
    idTipoFonte: "",
    emissao: "",
  });
  const [estatisticas, setEstatisticas] = useState<Estatisticas>({ max: null, min: null, avg: null });
  const [error, setError] = useState<string>("");
  const [selectedFonteId, setSelectedFonteId] = useState<string>("");

  useEffect(() => {
    fetch("/api/tipofontes")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTiposFonte(data);
        } else {
          setError("Failed to load energy sources: Unexpected response format");
        }
      })
      .catch((err) => setError("Failed to load energy sources: " + err));
  }, []);

  useEffect(() => {
    if (selectedFonteId) {
      refreshEmissoes(selectedFonteId);
    }
  }, [selectedFonteId]);

  const handleAddTipoFonte = async () => {
    try {
      const maxId =
        tiposFonte.length > 0
          ? Math.max(...tiposFonte.map((fonte) => fonte.id_tipo_fonte))
          : 0;
      const newId = maxId + 1;

      const novaFonte: TipoFonte = {
        id_tipo_fonte: newId,
        nome: novoNomeFonte,
      };

      const response = await fetch("/api/tipofontes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novaFonte),
      });

      if (response.ok) {
        alert("Tipo de Fonte added successfully!");
        setNovoNomeFonte("");
        refreshTipoFontes();
      } else {
        const errorData = await response.text();
        setError("Failed to add Tipo de Fonte: " + errorData);
      }
    } catch (err) {
      setError("Error adding Tipo de Fonte: " + err);
    }
  };

  const handleAddEmissao = async () => {
    try {
      const response = await fetch("/api/emissoes/tipo-fonte", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo_fonte: { id_tipo_fonte: parseInt(novaEmissao.idTipoFonte) },
          emissao: parseFloat(novaEmissao.emissao),
        }),
      });

      if (response.ok) {
        alert("Emissao added successfully!");
        setNovaEmissao({ idTipoFonte: "", emissao: "" });
        refreshEmissoes(selectedFonteId);
      } else {
        const errorData = await response.text();
        setError("Failed to add Emissao: " + errorData);
      }
    } catch (err) {
      setError("Error adding Emissao: " + err);
    }
  };

  const handleUpdateTipoFonte = async (id_tipo_fonte: number, newName: string) => {
    try {
      const response = await fetch(`/api/tipofontes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_tipo_fonte, nome: newName }),
      });

      if (response.ok) {
        alert("Tipo de Fonte updated successfully!");
        refreshTipoFontes();
      } else {
        const errorData = await response.text();
        setError("Failed to update Tipo de Fonte: " + errorData);
      }
    } catch (err) {
      setError("Error updating Tipo de Fonte: " + err);
    }
  };

  const handleDeleteTipoFonte = async (id_tipo_fonte: number) => {
    try {
      const response = await fetch(`/api/tipofontes?id_tipo_fonte=${id_tipo_fonte}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Tipo de Fonte deleted successfully!");
        refreshTipoFontes();
      } else {
        const errorData = await response.text();
        setError("Failed to delete Tipo de Fonte: " + errorData);
      }
    } catch (err) {
      setError("Error deleting Tipo de Fonte: " + err);
    }
  };

  const handleUpdateEmissao = async (id_emissao: number, newEmissaoValue: number) => {
    try {
      const response = await fetch(`/api/emissoes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_emissao, emissao: newEmissaoValue }),
      });

      if (response.ok) {
        alert("Emissao updated successfully!");
        refreshEmissoes(selectedFonteId);
      } else {
        const errorData = await response.text();
        setError("Failed to update Emissao: " + errorData);
      }
    } catch (err) {
      setError("Error updating Emissao: " + err);
    }
  };

  const handleDeleteEmissao = async (id_emissao: number) => {
    try {
      const response = await fetch(`/api/emissoes?id_emissao=${id_emissao}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Emissao deleted successfully!");
        refreshEmissoes(selectedFonteId);
      } else {
        const errorData = await response.text();
        setError("Failed to delete Emissao: " + errorData);
      }
    } catch (err) {
      setError("Error deleting Emissao: " + err);
    }
  };

  const refreshTipoFontes = () => {
    fetch("/api/tipofontes")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTiposFonte(data);
        }
      })
      .catch((err) => setError("Failed to update energy sources: " + err));
  };

  const refreshEmissoes = (idTipoFonte: string) => {
    if (!idTipoFonte) return;

    fetch(`/api/emissoes/${idTipoFonte}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEmissoes(data);
        } else {
          setError("Failed to load emissions: Unexpected response format");
        }
      })
      .catch((err) => setError("Failed to update emissions: " + err));
  };

  const handleFetchEstatisticas = async () => {
    try {
      const [maxResponse, minResponse, avgResponse] = await Promise.all([
        fetch("/api/emissoes/maior"),
        fetch("/api/emissoes/menor"),
        fetch("/api/emissoes/por-media"),
      ]);

      const maxData = await maxResponse.json();
      const minData = await minResponse.json();
      const avgData = await avgResponse.json();

      setEstatisticas({
        max: maxData.length > 0 ? maxData[0] : null,
        min: minData.length > 0 ? minData[0] : null,
        avg: avgData.media_emissao,
      });
    } catch (err) {
      setError("Error fetching statistics: " + err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6">Gerenciamento de Medias de Emissões e Tipos de Fontes de Energia</h2>

      {/* Add Tipo de Fonte */}
      <div className="mb-8">
        <h3 className="text-xl mb-4">Adicionar Tipo de Fonte de Energia</h3>
        <input
          type="text"
          value={novoNomeFonte}
          onChange={(e) => setNovoNomeFonte(e.target.value)}
          placeholder="Nome do Tipo de Fonte"
          className="p-2 border rounded mb-2"
        />
        <button
          onClick={handleAddTipoFonte}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Adicionar
        </button>
      </div>

      {/* Select Tipo de Fonte to Load Emissions */}
      <div className="mb-8">
        <h3 className="text-xl mb-4">Selecionar Tipo de Fonte para Ver Emissões</h3>
        <select
          value={selectedFonteId}
          onChange={(e) => setSelectedFonteId(e.target.value)}
          className="p-2 border rounded mb-2 w-full"
        >
          <option value="" disabled>Selecione o ID do Tipo de Fonte</option>
          {tiposFonte.map((fonte) => (
            <option key={fonte.id_tipo_fonte} value={fonte.id_tipo_fonte}>
              {fonte.nome} (ID: {fonte.id_tipo_fonte})
            </option>
          ))}
        </select>
      </div>

      {/* Add Emissao */}
      <div className="mb-8">
        <h3 className="text-xl mb-4">Adicionar Nova Emissão</h3>
        <select
          value={novaEmissao.idTipoFonte}
          onChange={(e) => setNovaEmissao({ ...novaEmissao, idTipoFonte: e.target.value })}
          className="p-2 border rounded mb-2 w-full"
          required
        >
          <option value="" disabled>Selecione o ID do Tipo de Fonte</option>
          {tiposFonte.map((fonte) => (
            <option key={fonte.id_tipo_fonte} value={fonte.id_tipo_fonte}>
              {fonte.nome} (ID: {fonte.id_tipo_fonte})
            </option>
          ))}
        </select>

        <input
          type="number"
          value={novaEmissao.emissao}
          onChange={(e) => setNovaEmissao({ ...novaEmissao, emissao: e.target.value })}
          placeholder="Valor da Emissão (em kg CO₂)"
          className="p-2 border rounded mb-2 w-full"
          required
        />

        <button
          onClick={handleAddEmissao}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Adicionar Emissão
        </button>
      </div>

      {/* Estatisticas */}
      <div className="mb-8">
        <h3 className="text-xl mb-4">Estatísticas de Emissões</h3>
        <button
          onClick={handleFetchEstatisticas}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Mostrar Estatísticas
        </button>
        {estatisticas.max && <p className="mt-4">Maior Emissão: {estatisticas.max.emissao}</p>}
        {estatisticas.min && <p>Menor Emissão: {estatisticas.min.emissao}</p>}
        {estatisticas.avg && <p>Média das Emissões: {estatisticas.avg}</p>}
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Tipos de Fontes List */}
      <div className="mt-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Tipos de Fontes de Energia</h3>
        <ul className="list-disc pl-6">
          {tiposFonte.map((fonte) => (
            <li key={fonte.id_tipo_fonte}>
              {fonte.nome} 
              <button
                onClick={() => handleUpdateTipoFonte(fonte.id_tipo_fonte, prompt("Novo nome:", fonte.nome) || fonte.nome)}
                className="bg-yellow-500 text-white ml-2 px-2 rounded hover:bg-yellow-700"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteTipoFonte(fonte.id_tipo_fonte)}
                className="bg-red-500 text-white ml-2 px-2 rounded hover:bg-red-700"
              >
                Deletar
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Emissões List */}
            <div className="mt-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Emissões Registradas</h3>
        <ul className="list-disc pl-6">
            {Array.isArray(emissoes) && emissoes.length > 0 ? (
            emissoes.map((emissao) => (
                <li key={emissao.id_emissao}>
                Fonte: {emissao.tipo_fonte?.nome ?? "Unknown"}, Emissão: {emissao.emissao} kg CO₂
                <button
                    onClick={() =>
                    handleUpdateEmissao(
                        emissao.id_emissao,
                        parseFloat(prompt("Novo valor de emissão:", String(emissao.emissao)) || String(emissao.emissao))
                    )
                    }
                    className="bg-yellow-500 text-white ml-2 px-2 rounded hover:bg-yellow-700"
                >
                    Editar
                </button>
                <button
                    onClick={() => handleDeleteEmissao(emissao.id_emissao)}
                    className="bg-red-500 text-white ml-2 px-2 rounded hover:bg-red-700"
                >
                    Deletar
                </button>
                </li>
            ))
            ) : (
            <li>Nenhuma emissão registrada</li>
            )}
        </ul>
        </div>
    </div>
  );
}
