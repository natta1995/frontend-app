import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface UserContextType {
  currentUser: { id: number; name: string } | null;
  setCurrentUser: (user: { id: number; name: string } | null) => void;
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
  } | null>(null);

  // Hämta användarinformation när UserProvider laddas
  useEffect(() => {
    console.log("Kör den här ens")
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("http://localhost:1337/users/profile", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data); // Spara användarinformationen i Context
          console.log("Här är vi nu", data )
        } else {
          console.error("Failed to fetch current user");
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

      fetchCurrentUser();
  }, []); // Körs bara när komponenten mountas

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
