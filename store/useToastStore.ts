import { create } from 'zustand';
import { type HunterToastType } from '@/components/common/HunterToast';

interface ToastState {
  visible: boolean;
  message: string;
  type: HunterToastType;
  duration?: number;
  showIcon?: boolean;
  showToast: (message: string, type?: HunterToastType, duration?: number, showIcon?: boolean) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: '',
  type: 'info',
  duration: 3000,
  showIcon: true,
  showToast: (message, type = 'info', duration = 3000, showIcon = true) =>
    set({ visible: true, message, type, duration, showIcon }),
  hideToast: () => set((state) => ({ ...state, visible: false })),
}));

export const showGlobalToast = (
  message: string,
  type: HunterToastType = 'info',
  duration: number = 3000,
  showIcon: boolean = true
) => {
  useToastStore.getState().showToast(message, type, duration, showIcon);
};
