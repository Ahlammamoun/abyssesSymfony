import 'bootstrap/dist/css/bootstrap.min.css';
import './app.scss'; 
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

const root = createRoot(document.getElementById('root')); // Utilisez createRoot directement
root.render(<App />);