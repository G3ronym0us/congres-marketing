import React, { ChangeEvent } from "react";

interface InputTextProps {
  value: string;
  error: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string; // Nuevo prop opcional para el tipo de input
}

const InputText = ({ value, error, onChange, type = "text" }: InputTextProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event);
  };

  return (
    <input
      type={type} // Usa el prop type, o "text" por defecto
      className={`bg-gray-200 rounded-lg px-4 py-2 text-black ${
        error ? "border-red-500" : "border-gray-300"
      }`}
      value={value}
      onChange={handleChange}
    />
  );
};

export default InputText;