import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Om användaren inte är inloggad, omdirigera till login
    if (!currentUser) {
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate]);

  // Om användaren är inloggad, visa den skyddade komponenten
  return currentUser ? children : null;
};

export default ProtectedRoute;
