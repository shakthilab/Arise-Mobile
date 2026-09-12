import React from 'react';
import { HunterToast } from './HunterToast';
import { useToastStore } from '@/store/useToastStore';

export function GlobalToast() {
  const { visible, message, type, duration, showIcon, hideToast } = useToastStore();

  return (
    <HunterToast
      visible={visible}
      message={message}
      type={type}
      duration={duration}
      showIcon={showIcon}
      onHide={hideToast}
    />
  );
}
