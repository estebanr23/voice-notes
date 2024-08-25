import React, { useState, useRef } from 'react';
import { Eraser, LetterText, Mic, Send } from 'lucide-react';

const formFormat: any = {
  nombre: "Nombre de la persona en formato string",
  apellido: "Apellido de la persona en formato string",
  documento: "Documento de la persona en formato numerico",
  email: "Correo electronico de la persona en formato string",
  pais: "Pais de la persona en formato string",
  provincia: "Provincia de la persona en formato string",
  ciudad: "Ciudad de la persona en formato string",
  comentario: "Comentario de la persona en formato string"
};

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    
    mediaRecorderRef.current.ondataavailable = event => {
      audioChunksRef.current.push(event.data);
    };
    
    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      setAudioBlob(audioBlob);
      audioChunksRef.current = [];
    };
    
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadedFile(file);
  };


  const resetFiles = () => {
    setAudioBlob(null);
    setUploadedFile(null);
    setTranscript('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const onSubmit = async (): Promise<void> => {
    setIsLoading(true);

    // if (!audioBlob && !uploadedFile) return;
    const formData = new FormData();
    formData.append('files', audioBlob ? audioBlob : uploadedFile!) // uploadFile! - Le estás asegurando al compilador que esa variable definitivamente no es null o undefined en ese momento.
    formData.append('form_format', JSON.stringify(formFormat));

    const response = await fetch('http://localhost:8000/whisper/', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    console.log(data.results[0].transcript);
    setTranscript(data.results[0].transcript);

    setIsLoading(false);
  }

  return (
    <React.Fragment>
        <div className='h-screen flex items-center justify-center'>
            <div className='grid grid-cols-1 lg:grid-cols-3'>
                <form className='col-start-1 lg:col-start-2 col-span-1 flex flex-col justify-center items-center rounded-md border mx-2 px-4 py-6 lg:mx-0'>
                    <h3 className='text-2xl font-semibold m-0'>De Voz a Texto</h3>
                    <span className='text-md'>Graba y envía el mensaje de voz a transcribir.</span>

                    {/* Adjuntar archivo */}
                    <div className='flex flex-col gap-y-1 w-full my-4'>
                        <label htmlFor="files" className='font-semibold'>Adjuntar archivo</label>
                        <input type="file" id='files' onChange={(e) => handleFile(e)} className='p-1 border rounded-md' ref={fileInputRef} disabled={!!audioBlob}/>
                    </div>

                    {/* Grabar audio */}
                    {isRecording && 
                    (<div className="flex justify-end items-center gap-x-2">
                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        <p className="text-sm text-muted-foreground">Grabando...</p>
                    </div>)
                    }

                    {audioBlob && <audio className='w-full h-10' controls src={URL.createObjectURL(audioBlob)} />}

                    {uploadedFile && <audio className='w-full h-10' controls src={URL.createObjectURL(uploadedFile)} />}

                    {
                      (transcript === '') && 
                      <>
                        <div className='flex flex-col gap-y-1 w-full mt-4'>
                            <button 
                              type='button' 
                              onClick={isRecording ? stopRecording : startRecording} 
                              className='px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md disabled:bg-slate-400' 
                              disabled={!!uploadedFile}
                            >
                                <Mic className='inline size-5 mr-1'/>{isRecording ? 'Stop Recording' : 'Start Recording'}
                            </button>    
                        </div>

                        <div className='flex flex-col gap-y-1 w-full mt-4'>
                            <button 
                              type='button' 
                              onClick={onSubmit} 
                              className='px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md disabled:bg-slate-400'
                              disabled={isLoading}
                            >
                                <Send className='inline size-5 mr-1'/> Enviar
                            </button>    
                        </div>
                      </>
                    }

                    {
                      (audioBlob || uploadedFile) && 
                      <div className='flex flex-col gap-y-1 w-full mt-4'>
                          <button 
                          type='button' 
                          onClick={resetFiles} 
                          className='px-4 py-2 bg-transparent hover:bg-red-400 border border-red-400 text-red-600 hover:text-white rounded-md'
                          >
                              <Eraser className='inline size-5 mr-1'/> Limpiar
                          </button>    
                      </div>
                    }
                    
                    {
                      isLoading && <p className='text-center mt-4'><LetterText className='inline size-5 mr-1'/>Traduciendo...</p>
                    }

                    {transcript && (
                      <div className='mt-4 text-md'>
                        <h3 className='font-semibold'>Transcripción:</h3>
                        <p>{JSON.stringify(transcript)}</p>
                      </div>
                    )}
                </form>
            </div>
        </div>
    </React.Fragment>
  );
};

export default AudioRecorder;
