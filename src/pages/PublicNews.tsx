import React from 'react'
import { useState, useEffect } from "react"
import axios from 'axios'

type NewsItem = {
   id: number;
   title: string;
   shortDescription: string;
   imagePath: string;
   createdAt: string;
}

const PublicNews = () => {
   const [newsList, setNewsList] = useState<NewsItem[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchNews = async () => {
         try {
            const res = await axios.get("http://localhost:3001/api/news");
            setNewsList(res.data);
         } catch (err) {
            console.error("Failed to fetch news", err);
         } finally {
            setLoading(false);
         }
      }

      fetchNews();
   }, [])

   return (
      <div className="max-w-4xl mx-auto mt-10 p-4">
         <h1 className="text-3xl font-bold mb-6 text-center">
            Latest News
         </h1>

         {loading ? (
            <p className="text-center">
               Loading...
            </p>
         ) : newsList.length === 0 ? (
            <p className="text-center">
               No news available at the moment.
            </p>
         ) : (
            <div className="grid grid-cols-2 gap-6">
               {newsList.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 shadow">
                     <img src={`http://localhost:3001${item.imagePath}`}
                        alt={item.title}
                        className="w-full max-h-64 object-cover rounded mb-4" />

                     <h2 className="text-xl font-semibold mb-2">
                        {item.title}
                     </h2>

                     <p className="text-gray-700">
                        {item.shortDescription}
                     </p>

                     <p className="text-sm text-gray-400 mt-2">
                        Posted: {new Date(item.createdAt).toLocaleDateString()}
                     </p>
                  </div>
               ))}
            </div>
         )}
      </div>
   )
}

export default PublicNews