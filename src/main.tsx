import React from 'react'
import ReactDOM from 'react-dom/client'
import AudioRecorder from './AudioRecorder.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AudioRecorder />
  </React.StrictMode>,
)
