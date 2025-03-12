import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // URL do seu backend
  timeout: 5000, // Tempo máximo para resposta
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
