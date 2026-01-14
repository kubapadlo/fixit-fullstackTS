import { create } from 'zustand';
import type {User} from '../types/user.type';

type UserStore = {
    isAuthenticated : boolean,
    user: User | null,
    setUser: (user:User) => void,
    logout: () => void
}

export const useLoggedUserState = create<UserStore>((set)=>({
    isAuthenticated : false,
    user : null,
    setUser : (user) => set({isAuthenticated:true, user:user}),
    logout: () => set({isAuthenticated:false, user:null})
}))