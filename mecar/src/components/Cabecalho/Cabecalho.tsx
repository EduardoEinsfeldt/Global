"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function Cabecalho() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updateLoginStatus = () => {
    const userSession = localStorage.getItem('userSession');
    setIsLoggedIn(userSession === 'true');
  };

  useEffect(() => {
    // Update the state on initial load
    updateLoginStatus();
  }, []);

  useEffect(() => {
    // Handle localStorage changes dynamically
    const handleStorageChange = () => {
      updateLoginStatus();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });

      if (response.ok) {
        localStorage.removeItem('userSession');
        setIsLoggedIn(false);
        alert('Logout successful!');
        router.push('/login');
      } else {
        alert('Failed to logout. Please try again.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An error occurred during logout. Please try again later.');
    }
  };

  return (
    <nav className="cabecalho bg-gradient-to-r from-green-700 to-green-900 p-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <ul className="flex space-x-8 text-white text-lg font-bold">
          <li className="hover:text-yellow-300 transition duration-300">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:text-yellow-300 transition duration-300">
            <Link href="/energia">Consumo</Link>
          </li>
          <li className="hover:text-yellow-300 transition duration-300">
            <Link href="/medias">Média</Link>
          </li>
          <li className="hover:text-yellow-300 transition duration-300">
            <Link href="/sobre-nos">Sobre Nós</Link>
          </li>
        </ul>
        <ul className="flex space-x-8 text-white text-lg font-bold">
          {!isLoggedIn ? (
            <>
              <li className="hover:text-yellow-300 transition duration-300">
                <Link href="/cadastro">Cadastrar</Link>
              </li>
              <li className="hover:text-yellow-300 transition duration-300">
                <Link href="/login">Login</Link>
              </li>
            </>
          ) : (
            <li>
              <button 
                onClick={handleLogout} 
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
