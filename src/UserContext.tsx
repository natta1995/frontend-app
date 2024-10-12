import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  currentUser: {
    id: number;
    name: string;
    username: string;
    email: string;
    age: number;
    workplace: string;
    school: string;
    bio: string;
    profile_image: string;
  } | null;
  setCurrentUser: (
    user: {
      id: number;
      name: string;
      username: string;
      email: string;
      age: number;
      workplace: string;
      school: string;
      bio: string;
      profile_image: string;
    } | null
  ) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<{
    id: number;
    name: string;
    username: string;
    email: string;
    age: number;
    workplace: string;
    school: string;
    bio: string;
    profile_image: string;
  } | null>(() => {
    // Försöker hämta användaren från localStorage när sidan laddas
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (currentUser) {
      // Spara användaren i localStorage när den uppdateras
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      // Ta bort användarinformationen från localStorage vid utloggning
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
