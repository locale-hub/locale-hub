import React, { Children } from 'react';
import { Menu } from '@headlessui/react';

export default function UserIcon({
  children,
  className,
  name,
  size,
}: {
  children?: React.ReactNode;
  className?: string;
  name: string;
  size?: 'small' | 'large';
}) {
  size ??= 'small';
  const initials = name
    .trim()
    .split(/[ ,]+/) // split on whitespace
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

  const iconSize = 'large' === size ? 'h-48 w-48 text-8xl' : 'h-8 w-8';

  return (
    <Menu as="div" className={`relative ${className}`}>
      <div>
        <Menu.Button className="flex max-w-xs m-auto items-center rounded-full bg-primary text-sm">
          <span className="sr-only">Open user menu</span>
          <div
            className={`${iconSize} rounded-full] grid grid-cols-1 place-content-center`}
          >
            <div className="inline-block align-middle">{initials}</div>
          </div>
        </Menu.Button>
      </div>
      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        {Children.toArray(children).map((item, idx) => (
          <Menu.Item key={idx}>{item}</Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
}
