import { Dialog } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import Button from '@locale-hub/design-system/button/button';
import Select from '@locale-hub/design-system/select/select';

export default function AddLocaleModal({
  isOpen,
  locales,
  onClose,
}: {
  isOpen: boolean;
  locales: { tag: string; name: string }[];
  onClose: (localeTag?: string) => void;
}) {
  const [locale, setLocale] = useState<string>(locales[0].tag);

  useEffect(() => {
    setLocale(locales[0].tag);
  }, [locales]);

  // TODO: Add file import feature

  return (
    <Dialog
      as="div"
      className="relative"
      open={isOpen}
      onClose={() => onClose()}
    >
      <div className="fixed z-40 inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-2xl h-2xl transform rounded-2xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title
              as="h2"
              className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              Add new locale
            </Dialog.Title>

            <div className="mt-2 text-black">
              <div className="w-96">
                <Select
                  label="Locale"
                  onSelect={(value) => setLocale(value.id)}
                  defaultSelected={{
                    id: locales[0].tag,
                    value: `${locales[0].tag} - ${locales[0].name}`,
                  }}
                  values={locales.map((locale) => ({
                    id: locale.tag,
                    value: `${locale.tag} - ${locale.name}`,
                  }))}
                />
              </div>
            </div>

            <div className="mt-8 text-black text-right">
              <Button type="cancel" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button type="confirm" onClick={() => onClose(locale)}>
                Save
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
