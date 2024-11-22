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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-200 text-gray-900">
      <h2 className="text-3xl font-bold mb-10 text-green-800">
        Gerenciamento de Medias de Emissões e Tipos de Fontes de Energia
      </h2>

      <div className="flex flex-wrap justify-center gap-10">
        <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-lg">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Adicionar Tipo de Fonte de Energia</h3>
          <input
            type="text"
            value={novoNomeFonte}
            onChange={(e) => setNovoNomeFonte(e.target.value)}
            placeholder="Nome do Tipo de Fonte"
            className="w-full p-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 mb-4"
          />
          <button
            onClick={handleAddTipoFonte}
            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-all duration-300"
          >
            Adicionar
          </button>
        </div>

        <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-lg">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Selecionar Tipo de Fonte para Ver Emissões</h3>
          <select
            value={selectedFonteId}
            onChange={(e) => setSelectedFonteId(e.target.value)}
            className="w-full p-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 mb-4"
          >
            <option value="" disabled>Selecione o ID do Tipo de Fonte</option>
            {tiposFonte.map((fonte) => (
              <option key={fonte.id_tipo_fonte} value={fonte.id_tipo_fonte}>
                {fonte.nome} (ID: {fonte.id_tipo_fonte})
              </option>
            ))}
          </select>
        </div>

        <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-lg">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Adicionar Nova Emissão</h3>
          <select
            value={novaEmissao.idTipoFonte}
            onChange={(e) => setNovaEmissao({ ...novaEmissao, idTipoFonte: e.target.value })}
            className="w-full p-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 mb-4"
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
            className="w-full p-3 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 mb-4"
            required
          />

          <button
            onClick={handleAddEmissao}
            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-all duration-300"
          >
            Adicionar Emissão
          </button>
        </div>

        <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-lg">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Estatísticas de Emissões</h3>
          <button
            onClick={handleFetchEstatisticas}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 mb-6"
          >
            Mostrar Estatísticas
          </button>
          {estatisticas.max && <p className="text-gray-800 mb-2">Maior Emissão: {estatisticas.max.emissao}</p>}
          {estatisticas.min && <p className="text-gray-800 mb-2">Menor Emissão: {estatisticas.min.emissao}</p>}
          {estatisticas.avg && <p className="text-gray-800">Média das Emissões: {estatisticas.avg}</p>}
        </div>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex flex-wrap justify-center gap-10 w-full mt-10">
        <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-lg">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Tipos de Fontes de Energia</h3>
          <ul className="list-disc pl-6 text-gray-800">
            {tiposFonte.map((fonte) => (
              <li key={fonte.id_tipo_fonte} className="mb-4">
                <span className="font-medium">{fonte.nome}</span>
                <button
                  onClick={() => handleUpdateTipoFonte(fonte.id_tipo_fonte, prompt("Novo nome:", fonte.nome) || fonte.nome)}
                  className="bg-yellow-500 text-white ml-4 px-3 py-2 rounded hover:bg-yellow-600 transition-all duration-300"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteTipoFonte(fonte.id_tipo_fonte)}
                  className="bg-red-500 text-white ml-2 px-3 py-2 rounded hover:bg-red-600 transition-all duration-300"
                >
                  Deletar
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full max-w-md bg-white rounded-lg p-8 shadow-lg">
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Emissões Registradas</h3>
          <ul className="list-disc pl-6 text-gray-800">
            {Array.isArray(emissoes) && emissoes.length > 0 ? (
              emissoes.map((emissao) => (
                <li key={emissao.id_emissao} className="mb-4">
                  <span className="font-medium">Fonte:</span> {emissao.tipo_fonte?.nome ?? "Unknown"}, <span className="font-medium">Emissão:</span> {emissao.emissao} kg CO₂
                  <button
                    onClick={() =>
                      handleUpdateEmissao(
                        emissao.id_emissao,
                        parseFloat(prompt("Novo valor de emissão:", String(emissao.emissao)) || String(emissao.emissao))
                      )
                    }
                    className="bg-yellow-500 text-white ml-4 px-3 py-2 rounded hover:bg-yellow-600 transition-all duration-300"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteEmissao(emissao.id_emissao)}
                    className="bg-red-500 text-white ml-2 px-3 py-2 rounded hover:bg-red-600 transition-all duration-300"
                  >
                    Deletar
                  </button>
                </li>
              ))
            ) : (
              <li className="text-gray-800">Nenhuma emissão registrada</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );

}
