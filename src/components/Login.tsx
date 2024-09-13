import React, { useState } from "react";
import styled from "styled-components";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const LogInContainer = styled.div`
  background-color: #d3efe5;
  padding: 10%;
  border-radius: 10px;
  border: 1px solid #d3efe5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
`;

interface LoginProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onLogin(username, password);

    if (success) {
      navigate("/feed");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={4}>
          <LogInContainer>
            <h2 className="text-center">Logga in</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formUsername" className="mb-3">
                <Form.Label>Användarnamn</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ange användarnamn"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Lösenord</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ange lösenord"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Logga in
              </Button>

              <div className="mt-3 text-center">
                <Link to="/register">Har du inget konto? Registrera här</Link>
              </div>
            </Form>
          </LogInContainer>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
