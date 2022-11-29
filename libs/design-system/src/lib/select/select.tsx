import React, { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { classNames } from '../../utils/class-names';

type SelectEntry = {
  id: string;
  value: string;
  image?: string;
};

export default function Select({
  defaultSelected,
  label,
  onSelect,
  values
}: {
  defaultSelected: SelectEntry,
  label: string,
  onSelect: (value: SelectEntry) => void,
  values: SelectEntry[]
}) {
  const [selected, setSelected] = useState<SelectEntry>();

  const onChange = (value: SelectEntry) => {
    setSelected(value);
    onSelect(value);
  }

  return <div><Listbox value={selected} onChange={onChange}>
    { ({ open }) => <>
      <label className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white">
        { label }
      </label>
      <div className="relative mt-1 text-black">
        <Listbox.Button className="relative w-full hover:cursor-pointer rounded-md border border-gray-300 bg-white
          bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
          py-2 pl-3 pr-10 h-10 text-left">
          <span className="flex items-center">
            { defaultSelected?.image || selected?.image && <img src={defaultSelected?.image ?? selected.image} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" /> }
            <span className="ml-3 block truncate">{defaultSelected?.value ?? selected?.value}</span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>

        <Transition
          show={open}
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 sm:text-sm">
            {values.map((entry) => (
              <Listbox.Option
                key={entry.id}
                className={({ active }) =>
                  classNames(
                    active ? 'text-white bg-primary' : 'text-gray-900',
                    'relative cursor-default select-none py-2 pl-3 pr-9'
                  )
                }
                value={entry}
              >
                {({ selected, active }) => (
                  <>
                    <div className="flex items-center">
                      { entry.image && <img src={entry.image} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" /> }
                      <span
                        className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                      >
                        {entry.value}
                      </span>
                    </div>

                    {selected ? (
                      <span
                        className={classNames(
                          active ? 'text-white' : 'text-primary',
                          'absolute inset-y-0 right-0 flex items-center pr-4'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </> }
  </Listbox></div>;
}
