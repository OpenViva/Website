import React, { useCallback, useContext, useMemo, useState } from "react";
import { LocalUserLoginRequest, LocalUserLoginResponse, LocalUserResponse, User } from "../../types/api";
import requestJSON from "../helpers/requestJSON";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const LocalUserContext = React.createContext({
  user: null as User | null,
  replaceUser: null as any as (user: User | null) => void,
  refreshUser: null as any as () => Promise<User | null>,
  logout: null as any as () => Promise<void>,
  login: null as any as (email: string, password: string) => Promise<User>,
});

interface LocalUserProviderProps {
  defaultUser?: User | null;
  children: React.ReactNode;
}

export function LocalUserProvider({ defaultUser = null, children }: LocalUserProviderProps) {
  const [user, setLocalUser] = useState(defaultUser);
  
  const refreshUser = useCallback(async () => {
    const user = await requestJSON<LocalUserResponse>({
      url: "/api/localUser",
    });
    
    setLocalUser(user);
    
    return user;
  }, []);
  
  const logout = useCallback(async () => {
    await requestJSON({
      url: "/api/localUser/logout",
      method: "POST",
    });
    
    setLocalUser(null);
  }, []);
  
  const login = useCallback(async (email: string, password: string) => {
    const user = await requestJSON<LocalUserLoginResponse, LocalUserLoginRequest>({
      url: "/api/localUser/login",
      method: "POST",
      data: { email, password },
    });
    
    setLocalUser(user);
    
    return user;
  }, []);
  
  const value = useMemo(() => ({ user, replaceUser: setLocalUser, refreshUser, logout, login }), [user, refreshUser, logout, login]);
  return (
    <LocalUserContext.Provider value={value} >
      {children}
    </LocalUserContext.Provider>
  );
}

export default function useLocalUser() {
  return useContext(LocalUserContext);
}
