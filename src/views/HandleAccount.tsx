import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { useUser } from "../UserContext";


const HandleAccount = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { currentUser } = useUser()

    const deleteAccount = async () => {
      if (!currentUser) {
        setError("Ingen användare är inloggas.");
        return;
      }

      const userId = currentUser.id;

      try {
        const response = await fetch("http://localhost:1337/users/delete/account", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Något gick fel");
        }
  
        setMessage("Ditt konto har tagits bort.");
        setError("");
      } catch (err) {
        const errorMessage = (err as Error).message || "Ett oväntat fel inträffade.";
        setMessage("");
        setError(errorMessage);
      }
    
    }
  return (
      <div style={{ textAlign: "center", paddingTop: "5%" }}>
        <h2>Vill du ta bort ditt konto?</h2>
        <p>Du vet väll att du när som helst kan ta bort ditt konto?</p>
        <p>OBS: Ett raderat konto går inte att återfå.</p>
        
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Button variant="danger" onClick={deleteAccount}>
          Radera Konto
        </Button>
      </div>
    );
}

export default HandleAccount;