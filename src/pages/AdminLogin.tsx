import React from 'react';
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [message, setMessage] = useState("");
   const navigate = useNavigate();

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
         const res = await axios.post("http://localhost:3001/api/auth/login",
            { username, password },
            { withCredentials: true }
         );
         setMessage(res.data.message);
         navigate("/admin/news-list");
      } catch (err: any) {
         setMessage(err?.response?.data?.error || "An error occurred. Please try again.");
      }
   }

   return (
      <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow ml-auto mr-auto">
         <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
         {message && <p className="text-red-500 mb-2">{message}</p>}
         <form onSubmit={handleLogin} className="space-y-4">
            <input
               type="text"
               placeholder="Username"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               className="w-full p-2 border rounded"
               required
            />
            <input
               type="password"
               placeholder="Password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="w-full p-2 border rounded"
               required
            />
            <button
               type="submit"
               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer transition"
            >
               Login
            </button>
         </form>
      </div>
   )
}

export default AdminLogin;