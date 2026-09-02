import React from 'react';
import { HunterToast } from './HunterToast';
import { useToastStore } from '@/store/useToastStore';

export function GlobalToast() {
  const { visible, message, type, duration, hideToast } = useToastStore();

  return (
    <HunterToast
      visible={visible}
      message={message}
      type={type}
      duration={duration}
      onHide={hideToast}
    />
  );
}
