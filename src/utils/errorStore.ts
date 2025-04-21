import { create } from "zustand";

interface ErrorState {
  disabledError: boolean;
  setDisabledError: (val: boolean) => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  disabledError: false,
  setDisabledError: (val) => set({ disabledError: val }),
}));
