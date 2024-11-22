"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        
        localStorage.setItem('userSession', 'true');
        
        window.dispatchEvent(new Event('storage'));
        alert('Login bem-sucedido!');
        router.push('/');
      } else {
        const errorData = await response.json();
        setError('Login falhou: ' + errorData.error);
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      setError('Um erro ocorreu durante o login, por favor tente novamente mais tarde.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-200">
      <h2 className="text-3xl font-bold mb-10 text-green-800">Entrar</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-lg p-8 shadow-lg">
        <div className="mb-6">
          <label htmlFor="username" className="block text-lg font-semibold mb-3 text-gray-800">Nome de Usuário</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-4 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />
        </div>
  
        <div className="mb-6">
          <label htmlFor="password" className="block text-lg font-semibold mb-3 text-gray-800">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-4 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
            required
            minLength={6}
          />
        </div>
  
        {error && <p className="text-red-600 mb-6">{error}</p>}
  
        <button 
          type="submit" 
          className="w-full bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-all duration-300"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}