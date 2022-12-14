import React from 'react';

export default function Button({
  children,
  className,
  disabled,
  onClick,
  type,
}: {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'action' | 'default' | 'cancel' | 'confirm';
}) {
  type ??= 'default';
  disabled ??= false;

  const commonColorStyles = 'text-white disabled:cursor-not-allowed';

  const colors = {
    action: `${commonColorStyles} bg-primary enabled:hover:bg-opacity-80`,
    default: `${commonColorStyles} bg-slate-500 enabled:hover:bg-opacity-80`,
    cancel: `${commonColorStyles} bg-warn enabled:hover:bg-opacity-80`,
    confirm: `${commonColorStyles} bg-primary enabled:hover:bg-opacity-80`,
  };

  return (
    <button
      type="button"
      className={`
      ${className}
      px-5 py-2.5 mr-2 mb-2 text-white font-medium rounded-lg text-sm focus:outline-none
      ${colors[type]}
    `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
