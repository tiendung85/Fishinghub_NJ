import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'react-bootstrap/dist/react-bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/styles/Header.css'; 
import App from './App';
import { AuthProvider } from './pages/Auth/AuthContext'; 


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
       <AuthProvider>
         <App />
       </AuthProvider>
   
  </React.StrictMode>
);


