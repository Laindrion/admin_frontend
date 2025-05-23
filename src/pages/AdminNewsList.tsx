import { useState, useEffect } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import TiptapEditor from "@/components/ui/editor";
import { Button } from "@/components/ui/button";

type NewsItem = {
   id: number;
   title_en: string;
   title_ru: string;
   title_uz: string;
   shortDescription_en: string;
   shortDescription_ru: string;
   shortDescription_uz: string;
   content_en: string;
   content_ru: string;
   content_uz: string;
   imagePath: string;
   content: string;
   createdAt: string;
}

const AdminNewsList = () => {
   const [newsList, setNewsList] = useState<NewsItem[]>([]);
   const [loading, setLoading] = useState(true);
   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

   const [editingId, setEditId] = useState<number | null>(null);

   const [editTitle_en, setEditTitle_en] = useState("");
   const [editTitle_ru, setEditTitle_ru] = useState("");
   const [editTitle_uz, setEditTitle_uz] = useState("");

   const [editDesc_en, setEditDesc_en] = useState("");
   const [editDesc_ru, setEditDesc_ru] = useState("");
   const [editDesc_uz, setEditDesc_uz] = useState("");

   const [editContent_en, setEditContent_en] = useState("");
   const [editContent_ru, setEditContent_ru] = useState("");
   const [editContent_uz, setEditContent_uz] = useState("");

   const [editImage, setEditImage] = useState<File | null>(null);

   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);

   const [selectedLang, setSelectedLang] = useState<"en" | "ru" | "uz">("en");

   const [formData, setFormData] = useState({
      title_en: "",
      title_ru: "",
      title_uz: "",
      shortDescription_en: "",
      shortDescription_ru: "",
      shortDescription_uz: "",
      content_en: "",
      content_ru: "",
      content_uz: "",
   })

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
            .then(res => {
               setNewsList(res.data.items);
               setTotalPages(res.data.totalPages);
            })
            .catch(err => console.error("Failed to fetch news", err))
            .finally(() => setLoading(false));
      }
   }, [isLoggedIn, currentPage]);

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

      setEditTitle_en(news.title_en);
      setEditTitle_ru(news.title_ru);
      setEditTitle_uz(news.title_uz);

      setEditDesc_en(news.shortDescription_en);
      setEditDesc_ru(news.shortDescription_ru);
      setEditDesc_uz(news.shortDescription_uz);

      setEditContent_en(news.content_en);
      setEditContent_ru(news.content_ru);
      setEditContent_uz(news.content_uz);

      setEditImage(null);
   }

   const handleSave = async (id: number) => {

      try {
         const formData = new FormData();

         formData.append("title_en", editTitle_en);
         formData.append("title_ru", editTitle_ru);
         formData.append("title_uz", editTitle_uz);

         formData.append("shortDescription_en", editDesc_en);
         formData.append("shortDescription_ru", editDesc_ru);
         formData.append("shortDescription_uz", editDesc_uz);

         formData.append("content_en", editContent_en);
         formData.append("content_ru", editContent_ru);
         formData.append("content_uz", editContent_uz);

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
                     title_en: editTitle_en,
                     title_ru: editTitle_ru,
                     title_uz: editTitle_uz,
                     shortDescription_en: editDesc_en,
                     shortDescription_ru: editDesc_ru,
                     shortDescription_uz: editDesc_uz,
                     content_en: editContent_en,
                     content_ru: editContent_ru,
                     content_uz: editContent_uz,
                     imagePath: editImage ? `/uploads/${editImage.name}` : item.imagePath,
                  } : item));

         // Reset states
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
                           <div className="border p-4 rounded shadow bg-white space-y-4">

                              {/* Language toggle */}
                              <div className="flex gap-2">
                                 {["en", "ru", "uz"].map((lang) => (
                                    <button
                                       key={lang}
                                       type="button"
                                       onClick={() => setSelectedLang(lang as "en" | "ru" | "uz")}
                                       className={`px-3 py-1 rounded cursor-pointer ${selectedLang === lang ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                                    >
                                       {lang.toUpperCase()}
                                    </button>
                                 ))}
                              </div>

                              {/* Language-specific inputs */}
                              {selectedLang === "en" && (
                                 <>
                                    <input
                                       type="text"
                                       value={editTitle_en}
                                       onChange={(e) => setEditTitle_en(e.target.value)}
                                       placeholder="Title (EN)"
                                       className="w-full border p-2 rounded"
                                    />
                                    <input
                                       type="text"
                                       value={editDesc_en}
                                       onChange={(e) => setEditDesc_en(e.target.value)}
                                       placeholder="Short Description (EN)"
                                       className="w-full border p-2 rounded"
                                    />
                                    <TiptapEditor content={editContent_en} setContent={setEditContent_en} />
                                 </>
                              )}

                              {selectedLang === "ru" && (
                                 <>
                                    <input
                                       type="text"
                                       value={editTitle_ru}
                                       onChange={(e) => setEditTitle_ru(e.target.value)}
                                       placeholder="Title (RU)"
                                       className="w-full border p-2 rounded"
                                    />
                                    <input
                                       type="text"
                                       value={editDesc_ru}
                                       onChange={(e) => setEditDesc_ru(e.target.value)}
                                       placeholder="Short Description (RU)"
                                       className="w-full border p-2 rounded"
                                    />
                                    <TiptapEditor content={editContent_ru} setContent={setEditContent_ru} />
                                 </>
                              )}

                              {selectedLang === "uz" && (
                                 <>
                                    <input
                                       type="text"
                                       value={editTitle_uz}
                                       onChange={(e) => setEditTitle_uz(e.target.value)}
                                       placeholder="Title (UZ)"
                                       className="w-full border p-2 rounded"
                                    />
                                    <input
                                       type="text"
                                       value={editDesc_uz}
                                       onChange={(e) => setEditDesc_uz(e.target.value)}
                                       placeholder="Short Description (UZ)"
                                       className="w-full border p-2 rounded"
                                    />
                                    <TiptapEditor content={editContent_uz} setContent={setEditContent_uz} />
                                 </>
                              )}

                              {/* Image preview + upload */}
                              <div>
                                 <img
                                    src={`http://localhost:3001${news.imagePath}`}
                                    alt="Preview"
                                    className="w-40 h-40 object-cover rounded mb-2"
                                 />
                                 <input type="file" onChange={(e) => setEditImage(e.target.files?.[0] || null)} />
                              </div>

                              {/* Save button */}
                              <button
                                 onClick={() => handleSave(news.id)}
                                 className="px-4 py-2 bg-green-600 text-white rounded mr-5 cursor-pointer"
                              >
                                 Save
                              </button>

                              {/* Cancel button */}
                              <button
                                 onClick={() => { setEditId(null); }}
                                 className="bg-gray-300 text-white px-3 py-2 rounded cursor-pointer"
                              >
                                 Cancel
                              </button>
                           </div>
                        </>
                     ) : (
                        <>
                           <h2 className="text-xl font-semibold">{news.title_en}</h2>
                           <p className="text-gray-700">{news.shortDescription_en}</p>
                           <img src={`http://localhost:3001${news.imagePath}`} alt="Preview" className="w-40 h-40 object-cover rounded" />
                           <button onClick={() => startEdit(news)} className="px-4 py-2 bg-blue-500 text-white rounded mr-3 cursor-pointer">
                              Edit
                           </button>
                           <button onClick={() => handleDelete(news.id)} className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer">
                              Delete
                           </button>
                        </>
                     )}
                  </div>
               ))}

               <div className="flex justify-center mt-6 gap-2 items-center">
                  <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
                     Prev
                  </button>
                  <span>
                     {currentPage} of {totalPages}
                  </span>
                  <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
                     Next
                  </button>
               </div>
            </div>
         )}
      </div>
   )
}
export default AdminNewsList;