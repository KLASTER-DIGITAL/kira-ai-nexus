
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// Импортируем глобальные стили для TipTap и Wiki-ссылок
import './styles/tiptap.css'
import './styles/wiki-links.css'
// Import для global.css если файл существует
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
