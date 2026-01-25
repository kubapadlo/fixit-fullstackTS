import { create } from 'zustand';
import type { AuthUser } from '@shared/index';

type UserStore = {
    isAuthenticated : boolean,
    user: AuthUser | null,
    setUser: (user: AuthUser) => void,
    logout: () => void
}

export const useLoggedUserState = create<UserStore>((set)=>({
    isAuthenticated : false,
    user : null,
    setUser : (user) => set({isAuthenticated:true, user:user}),
    logout: () => set({isAuthenticated:false, user:null})
}))