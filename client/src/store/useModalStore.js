import { create } from "zustand";

export const useModalStore = create((set) => ({
    isTodoModalOpen: false,
    openTodoModal: () => set({ isTodoModalOpen: true }),
    closeTodoModal: () => set({ isTodoModalOpen: false }),
}));