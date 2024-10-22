import React, { useState } from "react";
import LogoImg from "../Img/deer.webp";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

interface LoginProps {
  onLogin: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { setCurrentUser } = useUser();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:1337/users/profile", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        return await response.json();
      } else {
        console.error("Misslyckades att hämta användarprofil");
        return null;
      }
    } catch (error) {
      console.error("Fel vid hämtning av användarprofil:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { success, message } = await onLogin(username, password);

    if (success) {
      const userData = await fetchUserProfile();
      setCurrentUser(userData);
      navigate("/feed");
    } else {
      setErrorMessage(message); // Uppdatera felmeddelandet
    }
  };

  return (
    <Container className="mt-5">
      <Row className="align-items-center justify-content-center">
        <Col md={8} className="text-center">
          <img
            src={LogoImg}
            alt="LogoImage"
            style={{ width: "40%", height: "auto" }}
          />
          <h2 style={{ color: "#bc6c25" }}>DearFriends</h2>
          <p style={{ color: "#bc6c25" }}>Håll kontakten med dina vänner</p>
        </Col>

        <Col md={4}>
          <div
            className="p-4 rounded shadow"
            style={{ backgroundColor: "#ccd5ae" }}
          >
            <h2 className="text-center" style={{ color: "#bc6c25" }}>
              Logga in
            </h2>
            {errorMessage && (
              <Alert variant="danger" className="text-center">
                Felaktigt användarnamn eller lösenord.
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formUsername" className="mb-3">
                <Form.Label style={{ color: "#bc6c25" }}>
                  Användarnamn:
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ange användarnamn"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label style={{ color: "#bc6c25" }}>Lösenord:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ange lösenord"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                style={{
                  backgroundColor: "#bc6c25",
                  borderColor: "#bc6c25",
                  marginTop: "4%",
                }}
              >
                Logga in
              </Button>

              <div className="mt-3 text-center">
                <Link to="/register" style={{ color: "#bc6c25" }}>
                  Har du inget konto? Registrera här.
                </Link>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
