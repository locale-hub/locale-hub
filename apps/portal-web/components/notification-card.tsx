'use client';

import React from 'react';
import { ArchiveBoxArrowDownIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import Button from '@locale-hub/design-system/button/button';
import Card from '@locale-hub/design-system/card/card';
import { Notification } from '@locale-hub/data/models/notification.model';

export default function NotificationCard({
  notification,
  onArchive
}: {
  notification: Notification,
  onArchive: () => void
}) {

  return <Card className='text-black mb-4' title={notification.title}>
    <span dangerouslySetInnerHTML={{ __html: notification.text }} />
    <div className='mt-3 flex justify-end'>
      { notification.link && <Link href={notification.link}>
          <Button>
            <DocumentMagnifyingGlassIcon className='h-5 w-5' />
          </Button>
        </Link>
      }
      <Button onClick={onArchive} type='cancel'>
        <ArchiveBoxArrowDownIcon className='h-5 w-5' />
      </Button>
    </div>
  </Card>;
}
