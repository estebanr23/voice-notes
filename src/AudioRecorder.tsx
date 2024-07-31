import React, { useState, useRef } from 'react';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState('');
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
      await transcribeAudio(audioBlob);
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

  const transcribeAudio = async (audioBlob: Blob) => {
    const transcriptText = await transcribe(audioBlob);
    setTranscript(transcriptText);
  };

  const transcribe = async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('file', audioBlob);

    const response = await fetch('https://api.deepgram.com/v1/listen', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer TU_API_KEY`,
      },
      body: formData,
    });

    const data = await response.json();
    return data.transcript;
  };

  return (
    <React.Fragment>
        <div className='h-screen flex items-center justify-center'>
            <div className='grid grid-cols-3'>
                <form className='col-start-2 col-span-1 flex flex-col justify-center items-center rounded-md border px-4 py-6'>
                    <h3 className='text-2xl font-semibold m-0'>Voice Recording</h3>
                    <span className='text-md'>Record and send a voice message to our team.</span>

                    <div className='flex flex-col gap-y-1 w-full my-4'>
                        <label htmlFor="title">Title</label>
                        <input type="text" id='title' className='p-1 border rounded-md' placeholder='Title'/>
                    </div>

                    <div className='flex flex-col gap-y-1 w-full my-2'>
                        <button type='button' className='px-4 py-2 bg-slate-900 text-white rounded-md' onClick={isRecording ? stopRecording : startRecording}>
                            {isRecording ? 'Stop Recording' : 'Start Recording'}
                        </button>    
                    </div>

                    {isRecording && 
                    (<div className="flex justify-end items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        <p className="text-sm text-muted-foreground">Recording...</p>
                    </div>)
                    }

                    {audioBlob && <audio className='mt-4 w-full h-10' controls src={URL.createObjectURL(audioBlob)} />}
                    <p>{transcript}</p>
                </form>
            </div>
        </div>
    </React.Fragment>
  );
};

export default AudioRecorder;
