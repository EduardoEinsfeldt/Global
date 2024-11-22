"use client";

import { useEffect, useState } from "react";

export default function EnergyConsumptionPage() {
  const [consumptionKwh, setConsumptionKwh] = useState("");
  const [emissionResults, setEmissionResults] = useState<{
    [key: string]: number;
  } | null>(null);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 text-gray-900">
        <h2 className="text-3xl font-bold mb-8 text-green-800">
          Você precisa estar logado para acessar essa funcionalidade.
        </h2>
        <a
          href="/login"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
        >
          Fazer Login
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 text-gray-900">
      <div className="w-full max-w-2xl">
        <h2 className="text-4xl font-bold mb-12 text-green-800 text-center">
          Calcular Emissão de Gás Baseada na Energia Consumida
        </h2>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-10 shadow-xl mb-10">
          <div className="mb-6">
            <label htmlFor="consumptionKwh" className="block mb-3 font-semibold text-gray-800">
              Consumo de Energia (kWh)
            </label>
            <input
              id="consumptionKwh"
              name="consumptionKwh"
              type="number"
              value={consumptionKwh}
              onChange={handleChange}
              className="w-full p-4 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600 shadow-sm"
              required
              min="0"
            />
          </div>

          {error && <p className="text-red-600 mb-6 font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md font-semibold text-lg"
          >
            Calcular
          </button>
        </form>

        {emissionResults && (
          <div className="bg-white rounded-lg p-10 shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">
              Emissões de Carbono (g CO₂)
            </h3>
            <ul className="list-disc pl-10 text-gray-800 space-y-2">
              {Object.entries(emissionResults).map(([energyType, value]) => (
                <li key={energyType} className="text-lg">
                  {energyType}: {value.toFixed(2)} g CO₂
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 
