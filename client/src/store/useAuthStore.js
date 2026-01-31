import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from '../api/axios'

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isChecking: true,

            setAuth: (userData) => set({
                user: userData,
                isAuthenticated: true,
                isChecking: false
            }),

            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                })

                useAuthStore.persist.clearStorage();
            },

            checkAuth: async () => {
                set({ isChecking: true });
                try {
                    const response = await api.get('/user/profile');
                    set({
                        user: response.data,
                        isAuthenticated: true,
                        isChecking: false
                    });
                } catch (error) {
                    console.error("Auth check failed:", error);
                    set({
                        user: null,
                        isAuthenticated: false,
                        isChecking: false
                    });
                }
            },

            updateUser: (updatedData) => set((state) => ({
                user: { ...state.user, ...updatedData }
            })),
        }),
        {
            name: "taskflow-session",
        }
    )
);