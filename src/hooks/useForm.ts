import { useState } from "react";

const useForm = ({ initialValues }: any) => {
  const [form, setForm] = useState(initialValues);

  const onChangeInputValue = (e: any) => {
    const {name, value} = e.target;

    setForm({
      ...form, 
      [name]: value
    })
  }

  return {
    ...form,
    onChangeInputValue,
  };
}

export default useForm;
