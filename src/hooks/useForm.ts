import { useState } from "react";

const useForm = ({ initialValues }: any) => {
  const [form, setForm] = useState(initialValues);

  const onChangeInputValue = (e: any) => {
    const {name, value} = e.target;
    console.log(value)

    setForm({
      ...form, 
      [name]: value
    })
  }

  const onAutoCompleteForm = (form: object) => {
    Object.entries(form).forEach(([key, value]) => {
      setForm({
        ...form, 
        [key]: value
      })
    });
  }

  return {
    ...form,
    onChangeInputValue,
    onAutoCompleteForm
  };
}

export default useForm;
