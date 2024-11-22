import Image from "next/image";
import paisagem from "../../public/img/paisagem.png";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-200">
    <h1 className="text-5xl font-extrabold mb-10 text-green-800 drop-shadow-lg">Mecar</h1>
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl bg-white rounded-lg p-8 shadow-lg">
        <div className="w-full md:w-1/2 mb-8 md:mb-0 md:mr-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Medindo a Conscientização sobre a Emissão de Carbono
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Mecar tem como objetivo medir a emissão de carbono, para divulgar o
            conhecimento consciente sobre emissões pessoais. Nesse site, você pode
            medir a quantidade de emissão baseada em kWh, assim como ver uma média de
            Emissão, do nosso banco de dados.
          </p>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <Image
            src={paisagem}
            alt="Paisagem"
            className="rounded-lg shadow-md"
            width={500}
            height={400}
          />
        </div>
      </div>
    </div>
  );
}