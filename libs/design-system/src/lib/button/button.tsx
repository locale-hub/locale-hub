import React from 'react';



export default function Button({
  children,
  disabled,
  onClick,
  type
}: {
  children?: React.ReactNode,
  disabled?: boolean,
  onClick: () => void
  type?: 'action' | 'default' | 'cancel' | 'confirm'
}) {
  type ??= 'default';
  disabled ??= false;

  const colors = {
    action: 'text-white bg-primary hover:bg-opacity-80',
    default: 'text-white bg-slate-500 hover:bg-opacity-80',
    cancel: 'text-white bg-warn hover:bg-opacity-80',
    confirm: 'text-white bg-primary hover:bg-opacity-80'
  };

  return <button type="button" className={`
      px-5 py-2.5 mr-2 mb-2 text-white font-medium rounded-lg text-sm focus:outline-none
      ${colors[type]}
    `}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
}
