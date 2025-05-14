import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Navigate } from 'react-router-dom';

import TiptapEditor from '@/components/ui/editor';

const AdminDashboard = () => {
   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
   const [title, setTitle] = useState("");
   const [shortDescription, setShortDescription] = useState("");
   const [image, setImage] = useState<File | null>(null);
   const [content, setContent] = useState("");
   const [message, setMessage] = useState("");

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!image) return setMessage("Please select an image");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("shortDescription", shortDescription);
      formData.append("image", image);
      formData.append("content", content);

      try {
         const res = await axios.post("http://localhost:3001/api/news", formData, {
            withCredentials: true,
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });

         setMessage(res.data.message);
         setTitle("");
         setShortDescription("");
         setContent("");
         setImage(null);
      } catch (err: any) {
         setMessage(err?.response?.data?.error || "Upload failed");
      }
   };

   const handleLogout = async () => {
      try {
         await axios.post("http://localhost:3001/api/auth/logout", {}, { withCredentials: true });

         window.location.href = "/admin/login";
      } catch (err) {
         console.error('Logout failed:', err);
      }
   }

   // 🔐 Check session on component load
   useEffect(() => {
      axios.get('http://localhost:3001/api/auth/check', {
         withCredentials: true,
      })
         .then(res => {
            if (res.data.loggedIn) {
               setIsLoggedIn(true);
            } else {
               setIsLoggedIn(false);
            }
         })
         .catch(() => setIsLoggedIn(false));
   }, []);

   // 🔁 Redirect if not logged in
   if (isLoggedIn === false) return <Navigate to="/admin/login" replace />;
   if (isLoggedIn === null) return <div className="text-center mt-10">Checking login...</div>;

   return (
      <div className="max-w-xl mx-auto mt-10 p-4 border rounded-xl shadow">
         <h2 className="text-2xl font-bold mb-4">
            Create News
         </h2>

         {message && <p className="text-red-500 mb-2">{message}</p>}

         <form onSubmit={handleSubmit} className="space-y-4" action="">
            <input type="text"
               placeholder="Title"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               className="w-full p-2 border rounded"
               required
            />

            <textarea
               placeholder="Short Description"
               value={shortDescription}
               onChange={(e) => setShortDescription(e.target.value)}
               className="w-full p-2 border rounded"
               required
            ></textarea>

            <TiptapEditor content={content} setContent={setContent} />

            <input
               type="file"
               accept="image/*"
               onChange={(e) => setImage(e.target.files?.[0] || null)}
               className="w-full cursor-pointer"
            />
            <Button
               type="submit"
               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
            >
               Upload
            </Button>
         </form>

         <Button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4 mb-4 cursor-pointer"
         >
            Logout
         </Button>
      </div>
   )
}

export default AdminDashboard;