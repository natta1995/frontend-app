import React, { useState } from "react";
import styled from "styled-components";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const RegisterContainer = styled.div`
  background-color: #d3efe5;
  padding: 10%;
  border-radius: 10px;
  border: 1px solid #d3efe5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  background-color: #ccd5ae;
  color: #bc6c25;
`;

const InformationsText = styled.p`
  font-size: 12px;
`

interface RegisterProps {
  onRegister: (
    username: string,
    password: string,
    name: string,
    email: string,
    age: number
  ) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(username, password, name, email, age);
    navigate("/");
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={4}>

          <RegisterContainer>
            <h2 className="text-center">Skapa nytt konto</h2>
            <InformationsText> OBS! För din säkerhet så behöver lösenordet innehålla minst 8 tecken, en storbokstav, en liten bokstav, en siffra och ett specialtecken.</InformationsText>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Namn</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ange ditt namn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

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

              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ange din email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Lösenord </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ange lösenord"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formAge" className="mb-3">
                <Form.Label>Ålder</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ange din ålder"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100" style={{backgroundColor: "#bc6c25", borderColor: "#bc6c25" }}>
                Gå med
              </Button>

              <div className="mt-3 text-center" >
                <Link to="/" style={{color: "#bc6c25"}}>Har du redan ett konto? Logga in här</Link>
              </div>
            </Form>
          </RegisterContainer>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
