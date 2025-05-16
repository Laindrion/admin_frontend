import { useState, useEffect } from "react"
import axios from 'axios'
import { Link } from 'react-router-dom';

type NewsItem = {
   id: number;
   title: string;
   shortDescription: string;
   imagePath: string;
   content: string;
   createdAt: string;
}

const PublicNews = () => {
   const [newsList, setNewsList] = useState<NewsItem[]>([]);
   const [loading, setLoading] = useState(true);

   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);

   /*  useEffect(() => {
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
    }, []); */


   useEffect(() => {
      const fetchNews = async () => {
         try {
            setLoading(true);
            const res = await axios.get(`http://localhost:3001/api/news?page=${currentPage}`);
            setNewsList(res.data.items);
            setTotalPages(res.data.totalPages);
         } catch (err) {
            console.error("Failed to fetch news", err);
         } finally {
            setLoading(false);
         }
      }

      fetchNews();
   }, [currentPage]);

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
            <>
               <div className="grid grid-cols-2 gap-6">
                  {newsList.map((item) => (
                     <div key={item.id} className="border rounded-lg p-4 shadow">
                        <img src={`http://localhost:3001${item.imagePath}`}
                           alt={item.title}
                           className="w-full max-h-64 object-cover rounded mb-4" />

                        <h2 className="text-xl font-semibold mb-2">
                           <Link to={`/news/${item.id}`} className="text-blue-600 hover:underline">
                              {item.title}
                           </Link>
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

               <div className="flex justify-center mt-6 gap-2">
                  <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
                     Prev
                  </button>
                  <span>
                     Page {currentPage} of {totalPages}
                  </span>
                  <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
                     Next
                  </button>
               </div>
            </>

         )}
      </div>
   )
}

export default PublicNews