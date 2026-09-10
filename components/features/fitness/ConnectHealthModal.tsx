import React from 'react';
import { Modal } from 'react-native';
import { ConnectHealthView } from './ConnectHealthView';

interface ConnectHealthModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ConnectHealthModal({ visible, onClose }: ConnectHealthModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <ConnectHealthView onBack={onClose} showBackButton={true} isModal={true} />
    </Modal>
  );
}
