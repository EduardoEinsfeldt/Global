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
    <nav className="cabecalho">
      <ul className="flex space-x-4">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
            <Link href="/energia">Consumo de Energia</Link>
        </li>
        {!isLoggedIn ? (
          <>
            <li>
              <Link href="/cadastro">Cadastrar</Link>
            </li>
            <li>
              <Link href="/login">Login</Link>
            </li>
          </>
        ) : (
          <li>
            <button onClick={handleLogout} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
