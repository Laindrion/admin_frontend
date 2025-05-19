import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Navigate } from "react-router-dom";

import TiptapEditor from "@/components/ui/editor";
import type { TiptapEditorRef } from "@/components/ui/editor";

const AdminDashboard = () => {
   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
   const [image, setImage] = useState<File | null>(null);
   const [message, setMessage] = useState("");

   /* To clear the editor after submit */
   const editorRef = useRef<TiptapEditorRef>(null);

   const [activeLang, setActiveLang] = useState<"en" | "ru" | "uz">("en");

   /* Title */
   const [titleEn, setTitleEn] = useState("");
   const [titleRu, setTitleRu] = useState("");
   const [titleUz, setTitleUz] = useState("");

   /* Short description */
   const [descEn, setDescEn] = useState("");
   const [descRu, setDescRu] = useState("");
   const [descUz, setDescUz] = useState("");

   /* Contents (Tiptap) */
   const [contentEn, setContentEn] = useState("");
   const [contentRu, setContentRu] = useState("");
   const [contentUz, setContentUz] = useState("");


   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!image) return setMessage("Please select an image");

      const formData = new FormData();

      /* Title */
      formData.append("title_en", titleEn);
      formData.append("title_ru", titleRu);
      formData.append("title_uz", titleUz);

      /* Short description */
      formData.append("shortDescription_en", descEn);
      formData.append("shortDescription_ru", descRu);
      formData.append("shortDescription_uz", descUz);

      /* Content */
      formData.append("content_en", contentEn);
      formData.append("content_ru", contentRu);
      formData.append("content_uz", contentUz);

      /* Image */
      formData.append("image", image);


      try {
         const res = await axios.post("http://localhost:3001/api/news", formData, {
            withCredentials: true,
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });

         // ✅ Clear all fieldss
         setMessage(res.data.message);
         setImage(null);
         editorRef.current?.clear();
      } catch (err: any) {
         setMessage(err?.response?.data?.error || "Upload failed");
      }
   };

   // 🔐 Check session on component load
   useEffect(() => {
      axios.get("http://localhost:3001/api/auth/check", {
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
         <div className="flex">
            <h2 className="text-2xl font-bold mb-4">
               Create News
            </h2>

            <div className="flex gap-4 mb-4">
               {["en", "ru", "uz"].map((lang) => (
                  <button
                     key={lang}
                     type="button"
                     className={`px-4 py-2 rounded ${activeLang === lang ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                     onClick={() => setActiveLang(lang as "en" | "ru" | "uz")}
                  >
                     {lang.toUpperCase()}
                  </button>
               ))}
            </div>
         </div>


         {message && <p className="text-red-500 mb-2">{message}</p>}

         <form onSubmit={handleSubmit} className="space-y-4" action="">
            <input type="text"
               placeholder={`Title ${activeLang}`}
               value={
                  activeLang === "en" ? titleEn :
                     activeLang === "ru" ? titleRu : titleUz
               }
               onChange={(e) => {
                  const val = e.target.value;
                  if (activeLang === "en") setTitleEn(val);
                  else if (activeLang === "ru") setTitleRu(val);
                  else setTitleUz(val);
               }}
               className="w-full p-2 border rounded"
               required
            />

            <textarea
               placeholder={`Short Description ${activeLang}`}
               value={
                  activeLang === "en" ? descEn :
                     activeLang === "ru" ? descRu : descUz
               }
               onChange={(e) => {
                  const val = e.target.value;
                  if (activeLang === "en") setDescEn(val);
                  else if (activeLang === "ru") setDescRu(val);
                  else setDescUz(val);
               }}
               className="w-full p-2 border rounded"
               required
            ></textarea>

            <TiptapEditor
               content={
                  activeLang === "en" ? contentEn : activeLang === "ru" ? contentRu : contentUz
               }
               setContent={(val) => {
                  if (activeLang === "en") setContentEn(val);
                  else if (activeLang === "ru") setContentRu(val);
                  else setContentUz(val);
               }
               }

               ref={editorRef}
            />

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
      </div>
   )
}

export default AdminDashboard;