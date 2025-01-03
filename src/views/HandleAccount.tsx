import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useUser } from "../UserContext";

const HandleAccount = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { currentUser } = useUser();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const deleteAccount = async () => {
    if (!currentUser) {
      setError("Ingen användare är inloggas.");
      return;
    }

    const userId = currentUser.id;

    try {
      const response = await fetch(
        "http://localhost:1337/users/delete/account",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Något gick fel");
      }

      setMessage("Ditt konto har tagits bort.");
      setError("");
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Ett oväntat fel inträffade.";
      setMessage("");
      setError(errorMessage);
    }
  };
  return (
    <div style={{ textAlign: "center", paddingTop: "5%" }}>
      <h2>Vill du ta bort ditt konto?</h2>
      <p>Du vet väll att du när som helst kan ta bort ditt konto?</p>
      <p>OBS: Ett raderat konto går inte att återfå.</p>

      <Button variant="danger" onClick={handleShow}>
        Radera mitt konto
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>Radera konto</Modal.Header>
        <Modal.Body>
          <p>
            Är du säker på att du vill ta bort ditt konto? <br></br> VARNING ett
            raderat konto går inte att återfå.
          </p>
          <Button variant="danger" onClick={deleteAccount}>
            Radera konto
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Avbryt
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HandleAccount;
