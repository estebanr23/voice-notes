import React, { useState, useRef } from 'react';
import { Eraser, LetterText, Mic, Pause } from 'lucide-react';

const baseUrl = import.meta.env.VITE_API_URL;

interface Promps {
  formFormat: object,
  onTranscript: (textTranscript: object) => void;
}

const RecorderWhisper = ({ formFormat, onTranscript }: Promps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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

      await transcribeAudio(audioBlob);
    };
    
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

  };
  
  const resetFiles = () => {
    setAudioBlob(null);
    setTranscript('');
  }

  const transcribeAudio = async (audio: Blob): Promise<void> => {
    setIsLoading(true);

    if (!audio || !formFormat) return;
    const formData = new FormData();
    formData.append('files', audio)
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
        <div className='flex justify-end gap-2'>

          {/* Grabar audio */}
          {isRecording && 
            (<div className="flex justify-end items-center gap-x-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-sm text-muted-foreground">Grabando...</p>
            </div>)
          }

          {/* {audioBlob && <audio className='w-full h-10' controls src={URL.createObjectURL(audioBlob)} />} */}
        

          {
            (transcript === '' && !isLoading) && 
              <button 
                type='button' 
                onClick={isRecording ? stopRecording : startRecording} 
                className='mt-4 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md disabled:bg-slate-400' 
                disabled={!!audioBlob}
              >
                {isRecording 
                  ? <Pause className="size-5" />
                  : <Mic className="size-5" /> 
                }
              </button>    
          }

        
          {
            (audioBlob && !isLoading) && 
              <button 
                type='button' 
                onClick={resetFiles} 
                className='mt-4 px-4 py-2 bg-transparent hover:bg-slate-400 border border-slate-400 text-slate-600 hover:text-white rounded-md'
              >
                <Eraser className='inline size-4 mr-1'/> Reset
              </button>    
          }
          
          {
            isLoading && <p className='text-center mt-4'><LetterText className='inline size-5 mr-1'/>Transcribiendo...</p>
          }
        </div>
          

          {/* {transcript && (
            <div className='mt-4 text-md'>
              <h3 className='font-semibold'>Transcripción:</h3>
              <p>{JSON.stringify(transcript)}</p>
            </div>
          )} */}
    </React.Fragment>
  );
};

export default RecorderWhisper;
