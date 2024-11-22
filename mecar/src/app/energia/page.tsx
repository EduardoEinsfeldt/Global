"use client";

import { useEffect, useState } from "react";

export default function EnergyConsumptionPage() {
  const [consumptionKwh, setConsumptionKwh] = useState("");
  const [emissionResults, setEmissionResults] = useState<{
    [key: string]: number;
  } | null>(null);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is logged in
  useEffect(() => {
    const userSession = localStorage.getItem("userSession");
    setIsLoggedIn(userSession === "true");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConsumptionKwh(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!consumptionKwh) {
      setError("Por favor, coloque seu consumo de energia em kWh.");
      return;
    }

    setError("");

    try {
      const postResponse = await fetch("/api/energia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          consumptionKwh: parseFloat(consumptionKwh),
        }),
      });

      if (postResponse.ok) {
        const getResponse = await fetch(
          `/api/energia/calculate?consumptionKwh=${consumptionKwh}`
        );

        if (getResponse.ok) {
          const data = await getResponse.json();
          setEmissionResults(data);
        } else {
          const errorData = await getResponse.text();
          setError("Falha em calcular emissões: " + errorData);
        }
      } else {
        const postErrorData = await postResponse.text();
        setError("Falha em adicionar consumo de energia: " + postErrorData);
      }
    } catch (error) {
      console.error("Erro durante Request: ", error);
      setError(
        "Um erro ocorreu durante o processo, por favor tente novamente mais tarde."
      );
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h2 className="text-2xl font-bold mb-6">
          Você precisa estar logado para acessar essa funcionalidade.
        </h2>
        <a
          href="/login"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Fazer Login
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6">
        Calcular Emissão de Gás Baseada na Energia Consumida
      </h2>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-4">
          <label htmlFor="consumptionKwh" className="block mb-2">
            Consumo de Energia (kWh)
          </label>
          <input
            id="consumptionKwh"
            name="consumptionKwh"
            type="number"
            value={consumptionKwh}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            min="0"
          />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Calcular
        </button>
      </form>

      {emissionResults && (
        <div className="mt-6 w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4">
            Emissões de Carbono (g CO₂)
          </h3>
          <ul className="list-disc pl-6">
            {Object.entries(emissionResults).map(([energyType, value]) => (
              <li key={energyType}>
                {energyType}: {value.toFixed(2)} g CO₂
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
