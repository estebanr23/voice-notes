import React, { useState, useRef } from 'react';
import { Eraser, LetterText } from 'lucide-react';

const baseUrl = import.meta.env.VITE_API_URL;

interface Promps {
  formFormat: object,
  onTranscript: (textTranscript: object) => void;
}

const TranscribeWhisper = ({ formFormat, onTranscript }: Promps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadedFile(file);

    if (!file) return;
    await transcribeAudio(file);
  };

  const resetFiles = () => {
    setUploadedFile(null);
    setTranscript('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const transcribeAudio = async (audio: Blob): Promise<void> => {
    setIsLoading(true);

    if (!formFormat) return;
    const formData = new FormData();
    formData.append('files', audio);
    formData.append('form_format', JSON.stringify(formFormat));

    const response = await fetch(baseUrl, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    const textTranscript = data.results[0].transcript;
    setTranscript(textTranscript);

    onTranscript(textTranscript);
    setIsLoading(false);
  }

  return (
    <React.Fragment>
          {/* Adjuntar archivo */}
          <div className='flex flex-col gap-y-1 w-full my-4'>
              <label htmlFor="files" className='font-semibold'>Adjuntar archivo</label>
              <input type="file" id='files' onChange={(e) => handleFile(e)} className='p-1 border rounded-md' ref={fileInputRef} disabled={!!uploadedFile}/>
          </div>

          {uploadedFile && <audio className='w-full h-10' controls src={URL.createObjectURL(uploadedFile)} />}

          {
            (uploadedFile && !isLoading) &&
            <div className='flex justify-end'>
              <button 
                type='button' 
                onClick={resetFiles} 
                className='mt-4 px-4 py-2 bg-transparent hover:bg-slate-400 border border-slate-400 text-slate-600 hover:text-white rounded-md'
              >
                <Eraser className='inline size-5 mr-1'/> Reset
              </button>
            </div>
                  
          }
          
          {
            isLoading && <p className='text-center mt-4'><LetterText className='inline size-5 mr-1'/>Transcribiendo...</p>
          }

          {/* {transcript && (
            <div className='mt-4 text-md'>
              <h3 className='font-semibold'>Transcripción:</h3>
              <p>{JSON.stringify(transcript)}</p>
            </div>
          )} */}
    </React.Fragment>
  );
};

export default TranscribeWhisper;
