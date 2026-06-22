import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@/types";
import { mockUsers } from "@/data/mockData";

interface AuthState {
  user: User | null;
  login: (role: UserRole, username: string, password: string) => { ok: boolean; msg?: string };
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (role, username, password) => {
        const found = mockUsers.find(
          (u) => u.role === role && u.username === username
        );
        if (!found) {
          return { ok: false, msg: "账号或角色不匹配" };
        }
        if (found.password !== password) {
          return { ok: false, msg: "密码错误" };
        }
        const { password: _, ...userWithoutPwd } = found;
        set({ user: userWithoutPwd });
        return { ok: true };
      },
      logout: () => set({ user: null }),
    }),
    { name: "museum-auth" }
  )
);
