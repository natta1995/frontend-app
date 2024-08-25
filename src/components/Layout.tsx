import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import LogoImg from '../deer.webp';

const Layout: React.FC = () => {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
        <Navbar.Brand href="/feed" className="d-flex align-items-center">
            <img
              src={LogoImg}
              alt="Logo"
              width="30"
              height="30"
              className="d-inline-block align-top me-2"
            />
            DearFriends
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/feed">Hem</Nav.Link>
              <Nav.Link href="/profile">Profil</Nav.Link>
              <Nav.Link href="/">Logga ut</Nav.Link> {/*LÄGG TILL RIKTIG FUNKTIONALITET - AVSLUTA SEKTION*/}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div style={{ minHeight: 'calc(100vh - 100px)' }}>
        <Outlet /> 
      </div>

      <footer className="text-center py-3 bg-light">
        <Container>
          <p>© 2024 DearFriends. All rights reserved.</p>
        </Container>
      </footer>
    </>
  );
};

export default Layout;
