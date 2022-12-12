'use client';

import React, { useEffect, useState } from 'react';
import { Button, Spacer, Table } from '@locale-hub/design-system';
import { ManifestWithStatus } from '@locale-hub/data';
import { ApiConnector } from '@locale-hub/api-connector';
import TranslationModal from './translation-modal';
import AddLocaleModal from './add-locale-modal';
import AddKeyModal from './add-key-modal';
import CommitModal from './commit-modal';


export default function ProjectTranslationsPage({
  params
}: {
  params: { projectId: string }
}) {
  const [manifests, setManifests] = useState<ManifestWithStatus>();
  const [selectedLocale, setSelectedLocale] = useState<string>();
  const [entry, setEntry] = useState<{ locale: string, key: string, value: string }>();
  const [changesMade, setChangesMade] = useState(false);

  const [openTranslationModal, setOpenTranslationModal] = useState(false);
  const [openAddLocaleModal, setOpenAddLocaleModal] = useState(false);
  const [openAddKeyModal, setOpenAddKeyModal] = useState(false);
  const [openCommitModal, setOpenCommitModal] = useState(false);

  useEffect(() => {
    ApiConnector.projects.manifests.get(params.projectId).then((data) => {
      if ('error' in data) {
        // TODO: Toast
        return;
      }
      setManifests(data.manifest);
      setSelectedLocale(data.manifest.locales[0]);
    });
  }, [params.projectId]);

  const openEditor = (key: string) => {
    setEntry({
      locale: selectedLocale,
      key: key,
      value: manifests.manifest[selectedLocale][key]
    });
    setOpenTranslationModal(true);
  };

  const entryUpdate = (entry: { locale: string, key: string, value: string }) => {
    setOpenTranslationModal(false);
    if (undefined === entry || null === entry) {
      return;
    }
    setChangesMade(changesMade || manifests.manifest[entry.locale][entry.key] !== entry.value);
    manifests.manifest[entry.locale][entry.key] = entry.value;
    setManifests(manifests);
  };

  const onNewLocale = (locale: string) => {
    setOpenAddLocaleModal(false);
    if (undefined === locale || manifests.locales.includes(locale)) {
      return;
    }
    setManifests({
      locales: [...manifests.locales, locale],
      keys: manifests.keys,
      manifest: {
        ...manifests.manifest,
        [locale]: { // generate empty locale values with all required keys
          ...(() => {
            const obj = {};
            for (const key of manifests.keys) {
              obj[key] = '';
            }
            return obj;
          })()
        }
      }
    });
  }

  const onNewKey = (key: string) => {
    setOpenAddKeyModal(false);
    if (undefined === key || manifests.keys.includes(key)) {
      return;
    }
    const tmp = manifests.manifest;
    for (const locale of manifests.locales) {
      tmp[locale][key] = '';
    }

    setManifests({
      locales: manifests.locales,
      keys: [...manifests.keys, key],
      manifest: tmp
    });
  }

  const onNewCommit = (title: string, description: string) => {
    setOpenCommitModal(false);
    if (undefined === title || undefined === description) {
      return;
    }
    // TODO: Toast
    ApiConnector.projects.commits.post(params.projectId, manifests, title, description);
  }

  return <>
    <div className='flex'>
      <AddLocaleModal isOpen={openAddLocaleModal} onClose={onNewLocale} />
      <AddKeyModal isOpen={openAddKeyModal} onClose={onNewKey} />
      <CommitModal isOpen={openCommitModal} onClose={onNewCommit} />
      <TranslationModal isOpen={openTranslationModal} entry={entry} onClose={entryUpdate} />
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
        <Button onClick={() => setOpenAddLocaleModal(true)}>Add Locale</Button>
        <Button type='action' onClick={() => setOpenAddKeyModal(true)}>Add Translation key</Button>
        <Button type='cancel' disabled={false === changesMade}
                onClick={() => setOpenCommitModal(true)}
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
