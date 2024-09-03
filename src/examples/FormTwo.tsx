import { Label, TextInput } from "flowbite-react";
import TranscribeWhisper from "../TranscribeWhisper";
import RecorderWhisper from "../RecorderWhisper";
import { useState } from 'react';
import { ArrowRight, Send } from "lucide-react";
import { motion } from "framer-motion";
// import RecorderWhisper from "../RecorderWhisper";


interface Form {
    id: number,
    label: string,
    name: string,
    value: string,
    formFormat: object
}

const inputsForm: Form[] = [
    {
        id: 0,
        label: 'Nombre',
        name: 'nombre',
        value: '',
        formFormat: {nombre: "Nombre de la persona en formato string"}
    },
    {
        id: 1,
        label: 'Apellido',
        name: 'apellido',
        value: '',
        formFormat: {apellido: "Apellido de la persona en formato string",}
    },
    {
        id: 2,
        label: 'Descripcion',
        name: 'descripcion',
        value: '',
        formFormat: {descripcion: "Comentario de la persona en formato string"}
    }
];

const FormTwo = () => {
  const [step, setStep] =  useState<number>(0);
  const [input, setInput] =  useState<Form[]>(inputsForm);

  // Función callback para manejar la transcripción
  const handleTranscript = (transcript: object) => {
    console.log(transcript);

    // Logica para completar el formulario
    onAutoCompleteForm(transcript);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(input)
  }

  const onChangeInputValue = (e: any) => {
    const { name, value } = e.target;

    const newForm = input.map((f: Form) => {
        if (f.name === name) {
            return {
                ...f,
                value
            }
        }
        return f;
    });

    setInput(newForm);
  }

  const onAutoCompleteForm = (transcript: object) => {
    Object.entries(transcript).forEach(([key, value]) => {
        const newForm = input.map((f: Form) => {
            if(f.name === key) {
                return {
                    ...f,
                    value
                }
            }
            return f;
        })

        console.log(newForm)
        setInput(newForm)
    });
  }

  const decrementStep = () => {
    if(step === 0) return 0;
    setStep(step - 1);
  }

  const incremetStep = () => {
    console.log(step)
    if(step === inputsForm.length) return inputsForm.length;
    setStep(step + 1);
  }

  const firstLetterUpperCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className="h-screen flex flex-col justify-center">
        <h2 className="text-2xl font-semibold text-center">Formulario de Registro</h2>

        <motion.div
            key={step} // unique key to trigger animation on step change
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
        >
        <div>
            <div className="w-7/12 m-auto mt-4 p-4 border rounded-lg">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {
                        (step !== 3 && input[step]) && (
                                <div>
                                    <div className="mb-2 block">
                                        <Label htmlFor={input[step].name} value={input[step].label} />
                                    </div>
                                    <TextInput id={input[step].name} name={input[step].name} type="text" placeholder={input[step].label} value={ input[step].value } onChange={e => onChangeInputValue(e)} shadow /> 
                                    
                                    {/* <TranscribeWhisper formFormat={input[step].formFormat} onTranscript={handleTranscript} /> */}
                                    <RecorderWhisper formFormat={input[step].formFormat} onTranscript={handleTranscript} />
                                </div>
                        )
                    }
                        
                    {
                        step < 3 && (
                            <div className="flex justify-end gap-2">
                                {/* <Button type="button" color="red" onClick={decrementStep}>Volver</Button> */}

                                <button 
                                    type='button' 
                                    onClick={decrementStep}
                                    className='mt-2 px-4 py-2 bg-red-500 hover:bg-red-400 border border-red-500 text-white hover:border-red-400 rounded-md'
                                >
                                    Volver
                                </button>

                                {/* <Button type="button" onClick={incremetStep}>Siguiente</Button> */}

                                <button 
                                    type='button' 
                                    onClick={incremetStep}
                                    className='mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-800 text-white hover:border-slate-700 rounded-md'
                                >
                                    Siguiente <ArrowRight className='inline size-5'/>
                                </button>
                            </div>
                        )
                            
                    }


                    {
                        step === 3 && (
                            <div className="flex flex-col gap-4 my-2">
                                {
                                    input.map((i) => (
                                        <div key={i.id}>
                                            <p className="p-2 border rounded-lg"><span className="font-semibold">{ firstLetterUpperCase(i.name) }: </span>{ i.value }</p>
                                        </div>
                                    ))
                                }

                                <div className="flex justify-end gap-2">
                                    <button 
                                        type='button' 
                                        onClick={decrementStep}
                                        className='flex-1 mt-4 px-4 py-2 bg-red-500 hover:bg-red-400 border border-red-500 text-white hover:border-red-400 rounded-md'
                                    >
                                        Volver
                                    </button>

                                    <button 
                                        type='button' 
                                        onClick={handleSubmit}
                                        className='flex-1 mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-800 text-white hover:border-slate-700 rounded-md'
                                    >
                                        <Send className='inline size-4'/> Enviar 
                                    </button>
                                </div>
                            </div>
                        )
                    }
                </form>
            </div>
        </div>

        </motion.div>
    </div>
  );
}

export default FormTwo;