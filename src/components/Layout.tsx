import React from 'react';
import { useUser } from '../UserContext';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import LogoImg from '../deer.webp';

const Layout: React.FC = () => {

  const {currentUser} = useUser();
  console.log("här", currentUser)
  
  
  
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
          <Navbar.Collapse id="basic-navbar-nav"  >
            <Nav className="me-auto" >
              <Nav.Link href="/feed">Hem</Nav.Link>
              <Nav.Link href="/find-friends">Hantera Vänner</Nav.Link>
            </Nav>
              <Dropdown className="ms-auto" >
              <Dropdown.Toggle variant="ghostSecondary" id="dropdown-basic">
              {currentUser && currentUser.name ? currentUser.name : 'Laddar...'}
              </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href={currentUser && currentUser.name ? `/profile/${currentUser.name}` : '#'}>Min profil</Dropdown.Item>
                <Dropdown.Item href="/">Logga ut</Dropdown.Item> {/*LÄGG TILL RIKTIG FUNKTIONALITET - AVSLUTA SEKTION*/}
            </Dropdown.Menu>
            </Dropdown>
            
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
