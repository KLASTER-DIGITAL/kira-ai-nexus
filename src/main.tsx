
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
// Импортируем глобальные стили для TipTap и Wiki-ссылок
import './styles/tiptap.css'
import './styles/wiki-links.css'
// Import для global.css если файл существует
import './styles/global.css'
import { AuthProvider } from './context/auth'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
