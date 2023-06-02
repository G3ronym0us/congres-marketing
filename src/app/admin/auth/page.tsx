"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../../public/images/logo-congress.png";

const Login = () => {
  const router = useRouter();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    setError("");

    const url = process.env.NEXT_PUBLIC_URL + "api/auth/login";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.status === 401) {
      const responseData = await response.json();
      setError(responseData.message);
    } else if (response.status === 200) {
      const responseData = await response.json();
      localStorage.setItem("token", responseData.token);
      router.push("/admin/tickets"); // Redireccionar al dashboard después del inicio de sesión exitoso
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-6 bg-white rounded shadow">
        <div className="flex justify-center mb-4">
          <Image src={logo} className={`inline`} alt="" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">Iniciar sesión</h2>
        <div className="text-sm text-red-500 mb-2">{error}</div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Usuario
            </label>
            <input
              type="username"
              id="username"
              className="w-full px-3 py-2 border rounded"
              placeholder="Ingrese su usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
