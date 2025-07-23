'use client';

import { useState } from 'react';
import { ErrorTrigger } from '../../../components/error/ErrorTrigger';

export default function TestPage() {
  return (
    <div>
      <ErrorTrigger />
    </div>
  );
}
