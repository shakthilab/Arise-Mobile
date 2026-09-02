import { create } from 'zustand';
import { type HunterToastType } from '@/components/common/HunterToast';

interface ToastState {
  visible: boolean;
  message: string;
  type: HunterToastType;
  duration?: number;
  showToast: (message: string, type?: HunterToastType, duration?: number) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: '',
  type: 'info',
  duration: 3000,
  showToast: (message, type = 'info', duration = 3000) =>
    set({ visible: true, message, type, duration }),
  hideToast: () => set((state) => ({ ...state, visible: false })),
}));

export const showGlobalToast = (
  message: string,
  type: HunterToastType = 'info',
  duration: number = 3000
) => {
  useToastStore.getState().showToast(message, type, duration);
};
