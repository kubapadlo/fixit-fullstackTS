import { create } from 'zustand';
import type {User} from '../types/user.type';

type UserStore = {
    isAuthenticated : boolean,
    user: User | null,
    accessToken : string | null,
    setUser: (user:User, accessToken:string) => void
}

export const useLoggedUserState = create<UserStore>((set)=>({
    isAuthenticated : false,
    user : null,
    accessToken : null,
    setUser : (user, accessToken) => set({isAuthenticated:true, user:user, accessToken:accessToken})
}))