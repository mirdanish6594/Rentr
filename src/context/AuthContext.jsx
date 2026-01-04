import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Default to null so user sees Login screen first
  const [user, setUser] = useState(null);

  const login = (role) => {
    if (role === 'agent') {
      setUser({ 
        id: 102, // Different ID for Agent
        name: "Agent Smith", // Different Name
        role: "agent", 
        email: "smith@rentr.app" 
      });
    } else {
      setUser({ 
        id: 101, // Different ID for Contractor
        name: "Danish Mir", // Different Name
        role: "contractor", 
        email: "danish@rentr.app" 
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);