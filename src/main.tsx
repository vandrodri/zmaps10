import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import './index.css';
import { PaymentSuccess, PaymentPending, PaymentFailure } from "./components/PaymentPages";
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rota principal */}
        <Route path="/" element={<App />} />
        
        {/* Rotas de retorno do Mercado Pago */}
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/pending" element={<PaymentPending />} />
        <Route path="/failure" element={<PaymentFailure />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);