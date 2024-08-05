import { Button, Label, Select, Textarea, TextInput } from "flowbite-react";
import React from "react";
import useForm from "../hooks/useForm";
import { Mic } from "lucide-react";

const initialValues = {
  nombre: '',
  apellido: '',
  documento: '',
  fecha_nacimiento: '',
  email: '',
  pais: '',
  provincia: '',
  ciudad: '',
  comentario: ''
}
const FormOne = () => {
  const {
    nombre,
    apellido,
    documento,
    fecha_nacimiento,
    email,
    pais,
    provincia,
    ciudad,
    comentario,
    onChangeInputValue
  } = useForm(initialValues) ;

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log({
      nombre,
      apellido,
      documento,
      fecha_nacimiento,
      email,
      pais,
      provincia,
      ciudad,
      comentario
    })
  }

  return (
    <React.Fragment>
      <h2 className="text-lg font-semibold text-center my-4">Example 1</h2>
      <div className="w-7/12 m-auto mt-4 p-4 border rounded-lg">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* <form className="grid grid-cols-2 gap-2" onSubmit={handleSubmit}> */}
        <fieldset className="grid grid-cols-2 gap-2 text-lg font-semibold border rounded-lg px-4 pb-4">
          <legend className="px-2">Información Personal</legend>
          <div>
              <div className="mb-2 block">
                <Label htmlFor="nombre" value="Nombre" />
              </div>
              <TextInput id="nombre" name="nombre" type="text" placeholder="Nombre" value={nombre} onChange={e => onChangeInputValue(e)} shadow />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="apellido" value="Apelldo" />
              </div>
              <TextInput id="apellido" name="apellido" type="text" placeholder="Apellido" value={apellido} onChange={e => onChangeInputValue(e)} shadow />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="documento" value="Documento" />
              </div>
              <TextInput id="documento" name="documento" type="text" placeholder="Documento" value={documento} onChange={e => onChangeInputValue(e)} shadow />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="fecha_nacimiento" value="Fecha de Nacimiento" />
              </div>
              <TextInput id="fecha_nacimiento" name="fecha_nacimiento" type="date" placeholder="Fecha de Nacimiento" value={fecha_nacimiento} onChange={e => onChangeInputValue(e)} shadow />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput id="email" name="email" type="email" placeholder="name@flowbite.com" value={email} onChange={e => onChangeInputValue(e)} shadow />
            </div>
          </fieldset>


          <fieldset className="grid grid-cols-2 gap-2 text-lg font-semibold border rounded-lg px-4 pb-4">
            <legend className="px-2">Domicilio</legend>
            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="pais" value="Paises" />
              </div>
              <Select id="pais" name="pais" value={pais} onChange={e => onChangeInputValue(e)}>
                <option value="" disabled>Seleccionar pais</option>
                <option value="Estados Unidos">Estados Unidos</option>
                <option value="Argentina">Argentina</option>
                <option value="Brasil">Brasil</option>
              </Select>
            </div>

            <div className="max-w-md">
              <div className="mb-2 block">
                <Label htmlFor="provincia" value="Provincia" />
              </div>
              <Select id="provincia" name="provincia" value={provincia} onChange={e => onChangeInputValue(e)}>
                <option value="" disabled>Seleccionar pais</option>
                <option value="Catamarca">Catamarca</option>
                <option value="Buenos Aires">Buenos Aires</option>
                <option value="Tucuman">Tucuman</option>
              </Select>
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="ciudad" value="Ciudad" />
              </div>
              <TextInput id="ciudad" name="ciudad" type="text" placeholder="Ciudad" value={ciudad} onChange={e => onChangeInputValue(e)} shadow />
            </div>
          </fieldset>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="comentario" value="Comentario" />
            </div>
            <Textarea id="Comentario" name="comentario" placeholder="Escriba un comentario..." value={comentario} onChange={e => onChangeInputValue(e)} rows={4} />
          </div>

          <div className="flex justify-end gap-x-2">
            <Button color="failure" pill>
              <Mic className="size-5"/>
            </Button>
            <Button type="submit">Enviar</Button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
}

export default FormOne;