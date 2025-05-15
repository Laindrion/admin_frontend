import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin.tsx'
import AdminDashboard from './pages/AdminDashboard.tsx'
import PublicNews from './pages/PublicNews.tsx'
import AdminNewsList from './pages/AdminNewsList.tsx'
import PublicNewsDetails from './pages/PublicNewsDetails.tsx'

createRoot(document.getElementById('root')!).render(
   <React.StrictMode>
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<App />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/create-news" element={<AdminDashboard />} />
            <Route path="/news" element={<PublicNews />} />
            <Route path="/admin/news-list" element={<AdminNewsList />} />
            <Route path="/news/:id" element={<PublicNewsDetails />} />
         </Routes>
      </BrowserRouter>
   </React.StrictMode>,
)
