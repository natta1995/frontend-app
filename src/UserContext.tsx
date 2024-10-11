import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  currentUser: {
    id: number;
    name: string;
    username: string;
    email: string;
    age: number;
    profile_image: string;
  } | null;
  setCurrentUser: (
    user: {
      id: number;
      name: string;
      username: string;
      email: string;
      age: number;
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
    profile_image: string;
  } | null>(null);

  console.log("UserContexten här", currentUser); // TA BORT SEDAN

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
