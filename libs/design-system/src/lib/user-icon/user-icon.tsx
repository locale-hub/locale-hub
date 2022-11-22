
import React, { Children } from 'react';
import { Menu } from '@headlessui/react'

export default function UserIcon({
  name,
  children
}: {
  name: string,
  children?: React.ReactNode
}) {
  const initials = name
    .trim()
    .split(/[ ,]+/) // split on whitespace
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

  return <Menu as="div" className="relative ml-3">
    <div>
      <Menu.Button className="flex max-w-xs items-center rounded-full bg-primary text-sm">
        <span className="sr-only">Open user menu</span>
        <div className="h-8 w-8 rounded-full pt-[6px]">
          {initials}
        </div>
      </Menu.Button>
    </div>
    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      { Children.toArray(children)
          .map((item, idx) => <Menu.Item key={idx}>{item}</Menu.Item>)
      }
    </Menu.Items>
  </Menu>
}
