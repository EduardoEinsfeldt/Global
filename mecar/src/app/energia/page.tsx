"use client";

import { useState } from "react";

export default function EnergyConsumptionPage() {
  // State to handle consumption input, error messages, and results
  const [consumptionKwh, setConsumptionKwh] = useState("");
  const [emissionResults, setEmissionResults] = useState<{
    [key: string]: number;
  } | null>(null);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConsumptionKwh(e.target.value);
  };

  // Handle form submission to add energy consumption
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page refresh

    if (!consumptionKwh) {
      setError("Please enter the energy consumption in kWh.");
      return;
    }

    setError("");

    try {
      // Make POST request to save consumption
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
        // After successful POST request, make GET request to calculate emissions
        const getResponse = await fetch(
          `/api/energia/calculate?consumptionKwh=${consumptionKwh}`
        );

        if (getResponse.ok) {
          const data = await getResponse.json();
          setEmissionResults(data);
        } else {
          const errorData = await getResponse.text();
          setError("Failed to calculate emissions: " + errorData);
        }
      } else {
        const postErrorData = await postResponse.text();
        setError("Failed to add energy consumption: " + postErrorData);
      }
    } catch (error) {
      console.error("Error during request: ", error);
      setError(
        "An error occurred during the process. Please try again later."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6">Calculate Carbon Emissions</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-4">
          <label htmlFor="consumptionKwh" className="block mb-2">
            Energy Consumption (kWh)
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
          Calculate
        </button>
      </form>

      {emissionResults && (
        <div className="mt-6 w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4">Carbon Emissions (g CO₂)</h3>
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
