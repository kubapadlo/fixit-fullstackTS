import { create } from 'zustand';
import type {User} from '../types/user.type';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from "@react-native-async-storage/async-storage"

type UserStore = {
    isAuthenticated : boolean,
    user: User | null,
    accessToken : string | null,
    setUser: (user:User, accessToken:string) => void,
    logout: () => void
}


export const useLoggedUserState = create<UserStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      setUser: (user, accessToken) => 
        set({ isAuthenticated: true, user, accessToken }),
      logout: () => 
        set({ isAuthenticated: false, user: null, accessToken: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);


/*
export const useLoggedUserState = create<UserStore>()(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      setUser: (user, accessToken) => set({ isAuthenticated: true, user, accessToken }),
      logout: () => set({ isAuthenticated: false, user: null, accessToken: null }),
    }),
  
);
*/

// asyncStorage (asynchroniczy) = odpowiednik localStorage(synchroniczny)
// nieszyfrowna baza klucz wartosc na DYSKU smartfona - przechowujemy tylko male ilosci niewrażliwych danych
// dzieki persist stan jest zapisywany w AsyncStorage - nie trzeba sie logowac przy kazdym wejsciu do appki
// Gdy aplikacja startuje, Zustand sprawdza AsyncStorage. Jeśli znajdzie tam klucz user-storage, automatycznie wypełni stan danymi 
