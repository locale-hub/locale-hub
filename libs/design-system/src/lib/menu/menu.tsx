import { Menu as MenuBase } from '@headlessui/react';
import React, { Children } from 'react';

export default function Menu({
  button,
  children,
  onClick
}: {
  button: React.ReactNode,
  children?: React.ReactNode,
  onClick: () => void
}) {
  return (
    <div className="text-right">
      <MenuBase as="div" className="relative inline-block text-left">
        <MenuBase.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          {button}
        </MenuBase.Button>

        <MenuBase.Items className="absolute z-10 text-black right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          { children && Children.toArray(children).map((child, idx) => <MenuBase.Item key={idx}>
              <div onClick={onClick} className={`group flex w-full items-center rounded-md px-2 py-2 text-sm hover:cursor-pointer hover:bg-black hover:bg-opacity-10`}>{child}</div>
            </MenuBase.Item>
          )}
        </MenuBase.Items>
      </MenuBase>
    </div>
  )
}
