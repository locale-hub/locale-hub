'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, InputField, Modal, Select, Spacer, Table } from '@locale-hub/design-system';
import { ManifestEntry, ManifestWithStatus, Project, User } from '@locale-hub/data';
import { ApiConnector } from '@locale-hub/api-connector';
import { locales } from '../../../../../constants/locales';
import Link from 'next/link';
import { routes } from '../../../../../constants/routes';
import { CloudArrowUpIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import TranslationModal from './translation-modal';


export default function ProjectTranslationsPage({
  params
}: {
  params: { projectId: string }
}) {
  let originalManifests: ManifestWithStatus;

  const [selectedLocale, setSelectedLocale] = useState<string>();
  const [manifests, setManifests] = useState<ManifestWithStatus>();
  const [entry, setEntry] = useState<{ locale: string, key: string, value: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const [changesMade, setChangesMade] = useState(false);

  useEffect(() => {
    ApiConnector.projects.manifests.get(params.projectId).then((data) => {
      if ('error' in data) {
        // TODO: Toast
        return;
      }
      // stringify/parse operation is to force creation of a new Object.
      originalManifests = JSON.parse(JSON.stringify(data.manifest));

      setManifests(data.manifest);
      setSelectedLocale(data.manifest.locales[0]);
    });
  }, []);

  const openEditor = (key: string) => {
    setEntry({
      locale: selectedLocale,
      key: key,
      value: manifests.manifest[selectedLocale][key]
    });
    setIsOpen(true);
  };

  const entryUpdate = (entry: { locale: string, key: string, value: string }) => {
    setIsOpen(false);
    if (undefined === entry || null === entry) {
      return;
    }
    setChangesMade(changesMade || manifests.manifest[entry.locale][entry.key] !== entry.value);
    manifests.manifest[entry.locale][entry.key] = entry.value;
    setManifests(manifests);
  };

  return <>
    <div className='flex'>
      <TranslationModal isOpen={isOpen} entry={entry} onClose={entryUpdate} />
      <div className="inline-flex rounded-md border border-slate-400/50 overflow-hidden" role="group">
        { manifests && manifests.locales.map(locale =>
          <button onClick={() => setSelectedLocale(locale)} key={locale}
            className={`
              py-2 px-4 w-16 text-sm font-medium bg-white border-r border-slate-400/50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600
              ${selectedLocale === locale ? 'text-primary' : 'text-black dark:text-white'}
            `}>
            {locale}
          </button>
          )
        }
      </div>
      <Spacer />
      <div className='grid grid-cols-3 gap-4'>
        <Button onClick={() => {}}>Add Locale</Button>
        <Button type='action' onClick={() => {}}>Add Translation key</Button>
        <Button type='cancel' disabled={false === changesMade}
                onClick={() => {}}
        >Commit</Button>
      </div>
    </div>
    { manifests && <>
      <Table
        heads={[
          { key: 'status', label: 'Status', className: 'w-1/12' },
          { key: 'key', label: 'Key', className: 'w-3/12' },
          { key: 'preview', label: 'Preview', className: 'w-6/12' },
          { key: 'actions', label: 'Actions', className: 'w-2/12 text-center' }
        ]}
        entries={manifests.keys.map(key => ({
          status: '',
          key: key,
          preview: manifests.manifest[selectedLocale][key],
          actions: <div className='text-right'><Button onClick={() => openEditor(key)}>Open Editor</Button></div>
        }))}
      />
    </>}
  </>;
}
