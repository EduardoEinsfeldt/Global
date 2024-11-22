export default function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-200 text-gray-900">
        <h1 className="text-4xl font-bold text-green-800 mb-4">404 - Página Não Encontrada</h1>
        <p className="text-lg text-gray-700 mb-6">
          Desculpe, a página que você está procurando não existe.
        </p>
        <a
          href="/"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-300"
        >
          Voltar para a Página Inicial
        </a>
      </div>
    );
  }
  