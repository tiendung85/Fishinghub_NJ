import React, { createContext, useState, useContext } from "react";



const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);


  const login = async (email, password) => {
    const res = await fetch(`http://localhost:9999/users?email=${email}&password=${password}`);
    const data = await res.json();
  
    const foundUser = data.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}