'use client';

import React, { useState } from 'react';
import { ApiConnector } from '@locale-hub/api-connector';
import TranslationModal from './translation-modal';
import AddLocaleModal from './add-locale-modal';
import AddKeyModal from './add-key-modal';
import CommitModal from './commit-modal';
import toast from 'react-hot-toast';
import Table from '@locale-hub/design-system/table/table';
import Button from '@locale-hub/design-system/button/button';
import Spacer from '@locale-hub/design-system/spacer/spacer';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hook';
import {
  projectActions, selectProjectDetails,
  selectProjectManifests
} from '../../../../../redux/slices/projectSlice';
import { locales } from '../../../../../constants/locales';

export default function ProjectTranslationsPage({
  params,
}: {
  params: { projectId: string };
}) {
  const dispatch = useAppDispatch();
  const details = useAppSelector(selectProjectDetails);
  const manifests = useAppSelector(selectProjectManifests);
  const [selectedLocale, setSelectedLocale] = useState<string>(
    0 !== manifests.locales.length ? manifests.locales[0] : null
  );
  const [entry, setEntry] = useState<{
    locale: string;
    key: string;
    value: string;
  }>({ locale: '', key: '', value: '' });
  const [changesMade, setChangesMade] = useState(false);

  const [openTranslationModal, setOpenTranslationModal] = useState(false);
  const [openAddLocaleModal, setOpenAddLocaleModal] = useState(false);
  const [openAddKeyModal, setOpenAddKeyModal] = useState(false);
  const [openCommitModal, setOpenCommitModal] = useState(false);

  const openEditor = (key: string) => {
    setEntry({
      locale: selectedLocale,
      key: key,
      value: manifests.manifest[selectedLocale][key],
    });
    setOpenTranslationModal(true);
  };

  const entryUpdate = (entry: {
    locale: string;
    key: string;
    value: string;
  }) => {
    setOpenTranslationModal(false);
    if (undefined === entry || null === entry) {
      return;
    }
    setChangesMade(
      changesMade || manifests.manifest[entry.locale][entry.key] !== entry.value
    );
    dispatch(projectActions.manifestsUpdateEntry(entry));
  };

  const onNewLocale = (locale: string) => {
    setOpenAddLocaleModal(false);
    if (undefined === locale || manifests.locales.includes(locale)) {
      return;
    }
    dispatch(projectActions.manifestsAddLocale({ locale }));
    setSelectedLocale(locale);
  };

  const onNewKey = (key: string) => {
    setOpenAddKeyModal(false);
    if (undefined === key || manifests.keys.includes(key)) {
      return;
    }
    dispatch(projectActions.manifestsAddKey({ key }));
  };

  const onNewCommit = (title: string, description: string) => {
    setOpenCommitModal(false);
    if (undefined === title || undefined === description) {
      return;
    }
    ApiConnector.projects.commits
      .post(params.projectId, manifests, title, description)
      .then((data) => {
        if ('error' in data) {
          toast.error('Failed to commit changes');
          return;
        }
        toast.success('Changes commited');
      });
  };

  if (0 === manifests.locales.length) {
    // add setTimeout to avoid next error
    setTimeout(() => onNewLocale(details.project.defaultLocale), 50);
  }

  return (
    <>
      <div className="flex">
        <AddLocaleModal isOpen={openAddLocaleModal}
          locales={locales.filter((l) => false === manifests.locales.includes(l.tag))}
          onClose={onNewLocale}
        />
        <AddKeyModal isOpen={openAddKeyModal} onClose={onNewKey} />
        <CommitModal isOpen={openCommitModal} onClose={onNewCommit} />
        <TranslationModal
          isOpen={openTranslationModal}
          entry={entry}
          onClose={entryUpdate}
        />
        <div
          className="inline-flex rounded-md border border-slate-400/50 overflow-hidden"
          role="group"
        >
          {manifests &&
            manifests.locales.map((locale) => (
              <button
                onClick={() => setSelectedLocale(locale)}
                key={locale}
                className={`
              py-2 px-4 w-20 text-sm font-medium bg-white border-r border-slate-400/50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600
              ${
                selectedLocale === locale
                  ? 'text-primary'
                  : 'text-black dark:text-white'
              }
            `}
              >
                {locale}
              </button>
            ))}
        </div>
        <Spacer />
        <div className="grid grid-cols-3 gap-4">
          <Button onClick={() => setOpenAddLocaleModal(true)}>
            Add Locale
          </Button>
          <Button type="action" onClick={() => setOpenAddKeyModal(true)}>
            Add Translation key
          </Button>
          <Button
            type="cancel"
            disabled={false === changesMade}
            onClick={() => setOpenCommitModal(true)}
          >
            Commit
          </Button>
        </div>
      </div>
      {manifests && (
        <>
          <Table
            heads={[
              { key: 'status', label: 'Status', className: 'w-1/12' },
              { key: 'key', label: 'Key', className: 'w-3/12' },
              { key: 'preview', label: 'Preview', className: 'w-6/12' },
              {
                key: 'actions',
                label: 'Actions',
                className: 'w-2/12 text-center',
              },
            ]}
            entries={manifests.keys.map((key) => ({
              status: '',
              key: key,
              preview: manifests.manifest[selectedLocale][key],
              actions: (
                <div className="text-right">
                  <Button onClick={() => openEditor(key)}>Open Editor</Button>
                </div>
              ),
            }))}
          />
        </>
      )}
    </>
  );
}
