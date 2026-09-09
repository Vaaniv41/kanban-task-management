import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Main from "./components/Main";
import Dashboard from "./components/Dashboard";
import NotFound from './components/NotFound';


export default function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/board/:boardId" element={<Main />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  )
}