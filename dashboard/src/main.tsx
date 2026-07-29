import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import FlagDetail from './FlagDetail.tsx';
import Segments from './Segments.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/flags/:id" element={<FlagDetail />} />
        <Route path="/segments" element={<Segments />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);