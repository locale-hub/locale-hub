'use client';

import React, { useEffect, useState } from 'react';
import { ApiConnector } from '@locale-hub/api-connector';

export default function ProjectCommitsPage({
  params,
}: {
  params: { token: string };
}) {
  const [status, setStatus] = useState<'loading' | 'failure' | 'success'>(
    'loading'
  );

  useEffect(() => {
    ApiConnector.auth.validateEmail(params.token).then((data) => {
      setStatus('error' in data ? 'failure' : 'success');
    });
  }, [params.token]);

  return (
    <div className="px-10 py-48 m-auto w-full text-center">
      {'loading' === status && <p>Validating your email...</p>}
      {'failure' === status && (
        <p>
          Failure - We could not validate your email.
          <br />
          The link might be expired, please try again
        </p>
      )}
      {'success' === status && (
        <p>Success - Email has been added to you account!</p>
      )}
    </div>
  );
}
