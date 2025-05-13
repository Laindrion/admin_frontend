import { useState, useEffect } from "react";
import axios from 'axios';
import { Navigate } from 'react-router-dom';

type NewsItem = {
   id: number;
   title: string;
   shortDescription: string;
   imagePath: string;
   createdAt: string;
}

const AdminNewsList = () => {
   const [newsList, setNewsList] = useState<NewsItem[]>([]);
   const [loading, setLoading] = useState(true);
   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

   const [editingId, setEditingId] = useState<number | null>(null);
   const [editTitle, setEditTitle] = useState('');
   const [editDesc, setEditDesc] = useState('');

   const [editImage, setEditImage] = useState<File | null>(null);

   useEffect(() => {
      // Check log in
      axios.get('http://localhost:3001/api/auth/check', {
         withCredentials: true,
      })
         .then(() => setIsLoggedIn(true))
         .catch(() => setIsLoggedIn(false));
   }, []);

   useEffect(() => {
      if (isLoggedIn) {
         axios.get("http://localhost:3001/api/news")
            .then(res => setNewsList(res.data))
            .catch(err => console.error("Failed to fetch news", err))
            .finally(() => setLoading(false));
      }
   }, [isLoggedIn]);

   const handleDelete = async (id: number) => {
      if (!confirm("Are you sure you want to delete this news item?")) return;

      try {
         await axios.delete(`http://localhost:3001/api/news/${id}`, {
            withCredentials: true,
         });

         setNewsList(prev => prev.filter(item => item.id !== id));
      } catch (err) {
         console.error("Failed to delete news", err);
         alert("Failed to delete news");
      }
   }

   const startEdit = (news: NewsItem) => {
      setEditingId(news.id);
      setEditTitle(news.title);
      setEditDesc(news.shortDescription);
   }

   const handleSave = async (id: number) => {
      try {
         axios.put(`http://localhost:3001/api/news/${id}`, {
            title: editTitle,
            shortDescription: editDesc,
         }, {
            withCredentials: true,
         })

         setNewsList((prev) => prev.map((item) => item.id === id ? { ...item, title: editTitle, shortDescription: editDesc } : item));
         setEditingId(null);
      } catch (err) {
         console.error("Failed to update news", err);
      }
   }

   if (isLoggedIn === false) return <Navigate to="/admin/login" replace />
   if (loading === null || loading) return <div className="text-center mt-10">Loading...</div>;

   return (
      <div className="max-w-4xl mx-auto mt-10 p-4">
         <h2 className="text-2xl font-bold mb-6">
            Admin News Manager
         </h2>

         {newsList.length === 0 ? (
            <p>  No news available at the moment.</p>
         ) : (
            <div className="space-y-6">
               {newsList.map((news) => (
                  <div key={news.id} className="border rounded p-4 shadow">
                     {editingId === news.id ? (
                        <>
                           <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                              className="w-full cursor-pointer mb-2"
                           />
                           <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full border p-2 mb-2 rounded"
                           />
                           <textarea
                              value={editDesc}
                              onChange={(e) => { setEditDesc(e.target.value) }}
                              className="w-full border p-2 mb-2 rounded"
                           >
                           </textarea>

                           <button
                              onClick={() => handleSave(news.id)}
                              className="bg-green-600 text-white px-3 py-2 mr-2 rounded hover:bg-green-700"
                           >
                              Save
                           </button>

                           <button
                              onClick={() => { setEditingId(null); }}
                              className="bg-gray-300 text-white px-3 py-2 rounded"
                           >
                              Cancel
                           </button>
                        </>
                     ) : (
                        <>
                           <img src={`http://localhost:3001${news.imagePath}`} alt={news.title} className="full max-h-48 object-cover mb-2 rounded" />

                           <h3 className="text-xl font-semibold">
                              {news.title}
                           </h3>
                           <p className="text-gray-600">
                              {news.shortDescription}
                           </p>

                           <button
                              onClick={() => startEdit(news)}
                              className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
                           >
                              Edit
                           </button>

                           <button onClick={() => handleDelete(news.id)} className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                              Delete
                           </button>
                        </>
                     )}
                  </div>
               ))}
            </div>
         )}
      </div>
   )
}
export default AdminNewsList;