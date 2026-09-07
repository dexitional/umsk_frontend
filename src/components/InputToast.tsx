import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function InputToast({ resolve }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    resolve(inputValue);
    toast.dismiss();
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}