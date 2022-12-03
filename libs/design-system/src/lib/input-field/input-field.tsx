import React from 'react';

export default function InputField({
  name,
  label,
  value,
  onValue,
  required,
  placeholder,
  type
}: {
  name: string,
  label: string,
  value?: string,
  onValue: (value: string) => void,
  placeholder?: string,
  required?: boolean,
  type: 'email' | 'password' | 'text'
}) {
  required ??= false;
  const id = Math.random().toString(36).slice(2, 7);

  return <div className='mt-4'>
    <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {label}
    </label>
    <input id={id} name={name} type={type} value={value} onChange={(e) => onValue(e.target.value)}
           className="h-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary"
           placeholder={placeholder} required={required} />
  </div>;
}
