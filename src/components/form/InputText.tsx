import React, { ChangeEvent } from "react";

interface InputTextProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputText = (params: InputTextProps) => {

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    params.onChange(event);
  };

  return (
    <input
      type="text"
      className="bg-gray-200 rounded-lg px-4 py-2 text-black"
      value={params.value}
      onChange={handleChange}
    />
  );
};

export default InputText;
