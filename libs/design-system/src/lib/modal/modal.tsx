import { Dialog } from '@headlessui/react';
import React from 'react';

export default function Modal({
  isOpen,
  onClose,
  title,
  content,
  actions,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <>
      {isOpen && (
        <div className="fixed z-40 inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
      )}
      <Dialog
        as="div"
        className="relative z-50 "
        open={isOpen}
        onClose={onClose}
      >
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title
                as="h2"
                className="mb-4 text-lg font-medium leading-6 text-gray-900"
              >
                {title}
              </Dialog.Title>
              <div className="mt-2 text-black">{content}</div>

              <div className="mt-8 text-black text-right">{actions}</div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
