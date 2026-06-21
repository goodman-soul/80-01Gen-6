import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@/types";
import { mockUsers } from "@/data/mockData";

interface AuthState {
  user: User | null;
  login: (role: UserRole, username: string) => { ok: boolean; msg?: string };
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (role, username) => {
        const found = mockUsers.find(
          (u) => u.role === role && u.username === username
        );
        if (!found) {
          return { ok: false, msg: "账号或角色不匹配" };
        }
        set({ user: found });
        return { ok: true };
      },
      logout: () => set({ user: null }),
    }),
    { name: "museum-auth" }
  )
);
