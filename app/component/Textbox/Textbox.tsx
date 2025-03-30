import React from "react";
import "./Textbox.css";

type TextboxProps = {
  value: string; // The current value of the textbox
  onChange: (value: string) => void; // Callback to return the updated value
  placeholder?: string; // Optional placeholder text
};

const Textbox: React.FC<TextboxProps> = ({ value, onChange, placeholder = "Enter text" }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="textbox-container">
      <input
        type="text"
        className="textbox"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Textbox;