import { useParams, Navigate } from 'react-router-dom'
import { useState, useEffect } from "react"
import axios from 'axios'

type NewsItem = {
   id: number;
   title: string;
   shortDescription: string;
   imagePath: string;
   content: string;
   createdAt: string;
}

const PublicNewsDetails = () => {
   const { id } = useParams();
   const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
   const [notFound, setNotFound] = useState(false);

   useEffect(() => {
      axios.get(`http://localhost:3001/api/news/${id}`)
         .then((res) => setNewsItem(res.data))
         .catch(() => setNotFound(true));
   }, [id]);

   if (notFound) return <Navigate to="/news" />;
   if (!newsItem) return <div className="text-center mt-10"> Loading... </div>;

   return (
      <div className="max-w-3xl mx-auto mt-10 p-4">
         <h1 className="text-3xl font-bold mb-4">
            {newsItem.title}
         </h1>
         <img src={`http://localhost:3001${newsItem.imagePath}`} alt={newsItem.title} />
         <div
            className="prose max-w-none mt-5"
            dangerouslySetInnerHTML={{ __html: newsItem.content }}

         >
         </div>

         <p className="text-sm text-gray-400 mt-4">
            Published: {new Date(newsItem.createdAt).toLocaleDateString()}
         </p>
      </div>
   )
}

export default PublicNewsDetails;