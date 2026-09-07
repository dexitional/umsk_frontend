# umsa_frontend
# umsa_frontend


import React, { useState } from 'react';
import toast from 'react-hot-toast';

function InputToast({ resolve }) {
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
==================================================================


function showInputPrompt() {
  return new Promise((resolve) => {
    toast.custom((t) => <InputToast resolve={resolve} t={t} />);
  });
}

async function handleButtonClick() {
  const userInput = await showInputPrompt();
  if (userInput) {
    toast.success(`You entered: ${userInput}`);
  } else {
     toast('Input was cancelled.');
  }
}