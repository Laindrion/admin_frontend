import { useState, useEffect } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import TiptapEditor from "@/components/ui/editor";
import { Button } from "@/components/ui/button";

type NewsItem = {
   id: number;
   title: string;
   shortDescription: string;
   imagePath: string;
   content: string;
   createdAt: string;
}

const AdminNewsList = () => {
   const [newsList, setNewsList] = useState<NewsItem[]>([]);
   const [loading, setLoading] = useState(true);
   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

   const [editingId, setEditId] = useState<number | null>(null);
   const [editTitle, setEditTitle] = useState("");
   const [editDesc, setEditDesc] = useState("");
   const [editContent, setEditContent] = useState("");

   const [editImage, setEditImage] = useState<File | null>(null);

   useEffect(() => {
      // Check log in
      axios.get("http://localhost:3001/api/auth/check", {
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
      setEditId(news.id);
      setEditTitle(news.title);
      setEditDesc(news.shortDescription);
      setEditContent(news.content);
   }

   const handleSave = async (id: number) => {

      try {
         const formData = new FormData();
         formData.append("title", editTitle);
         formData.append("shortDescription", editDesc);
         formData.append("content", editContent);

         if (editImage) formData.append("image", editImage);

         await axios.put(`http://localhost:3001/api/news/${id}`, formData, {
            withCredentials: true,
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });

         setNewsList((prev) =>
            prev.map((item) =>
               item.id === id
                  ? {
                     ...item,
                     title: editTitle,
                     shortDescription: editDesc,
                     imagePath: editImage ? `/uploads${editImage.name}` : item.imagePath,
                     content: editContent
                  } : item));

         setEditImage(null);
         setEditId(null);
      } catch (err) {
         console.error("Failed to update news", err);
         alert("Update failed");
      }

   }

   const handleLogout = async () => {
      try {
         await axios.post("http://localhost:3001/api/auth/logout", {}, { withCredentials: true });

         window.location.href = "/admin/login";
      } catch (err) {
         console.error("Logout failed:", err);
      }
   }

   if (isLoggedIn === false) return <Navigate to="/admin/login" replace />
   if (loading === null || loading) return <div className="text-center mt-10">Loading...</div>;

   return (
      <div className="max-w-4xl mx-auto mt-10 p-4">
         <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold">
               Admin News Manager
            </h2>

            <div className="flex gap-4 items-center">
               <Link to={"/admin/create-news"}>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer text-sm">
                     Create News
                  </button>
               </Link>

               <Button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
               >
                  Logout
               </Button>
            </div>
         </div>


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

                           <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="w-full border p-2 mb-2 rounded">
                           </textarea>

                           <TiptapEditor content={editContent} setContent={setEditContent} />

                           <button
                              onClick={() => handleSave(news.id)}
                              className="bg-green-600 text-white px-3 py-2 mr-2 rounded hover:bg-green-700 cursor-pointer"
                           >
                              Save
                           </button>

                           <button
                              onClick={() => { setEditId(null); }}
                              className="bg-gray-300 text-white px-3 py-2 rounded cursor-pointer"
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

                           <button
                              onClick={() => startEdit(news)}
                              className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2 cursor-pointer"
                           >
                              Edit
                           </button>

                           <button onClick={() => handleDelete(news.id)} className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer">
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