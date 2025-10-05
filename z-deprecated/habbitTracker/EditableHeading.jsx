import React, { useState } from 'react';

const EditableHeading = ({ initialValue, onValueChange }) => {
  const [value, setValue] = useState(initialValue);

  const handleValueChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onValueChange(newValue);
  };


  return (
    <div className="relative">

      <input
        type="text"
        value={value}
        onChange={handleValueChange}
        className="bg-transparent lg:text-2xl text-xl font-semibold p-1 w-full border border-gray-300 rounded focus:outline-none focus:border-none"
        autoFocus
      />

    </div>
  );
};

export default EditableHeading;
