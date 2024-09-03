import React from 'react'
import ReactDOM from 'react-dom/client'
// import AudioRecorder from './AudioRecorder.tsx'
import FormOne from './examples/FormOne.tsx'
import './index.css'
import FormTwo from './examples/FormTwo.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <AudioRecorder /> */}
    {/* <FormOne /> */}
    <FormTwo />
  </React.StrictMode>,
)
