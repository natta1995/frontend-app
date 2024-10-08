import React, { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import LogoImg from "../Img/deer.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUserGroup,
  faGear,
  faRightFromBracket,
  faUser,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";



const Layout: React.FC = () => {
  const { currentUser } = useUser();
  const [pendingRequests, setPendingRequests] = useState<number>(0);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await fetch("http://localhost:1337/friends/requests", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setPendingRequests(data.length);
        } else {
          console.error("Failed to fetch pending friend requests");
        }
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };

    fetchPendingRequests();
  }, []);

  console.log("Här är det", currentUser)

  return (
    <>
      <Navbar bg="light">
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
          
            <Nav className="me-auto">
              <Nav.Link href="/feed">
                <FontAwesomeIcon icon={faHouse} />
              </Nav.Link>
              <Nav.Link href="/find-friends" style={{ position: "relative" }}>
                <FontAwesomeIcon icon={faUserGroup} />
                {pendingRequests > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "0.2",
                      right: "5px",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#e4190f",
                      borderRadius: "50%",
                      display: "inline-block",
                    }}
                  ></span>
                )}
              </Nav.Link>
              <Nav.Link href="/my-friends">
                <FontAwesomeIcon icon={faHeart} />
              </Nav.Link>
            </Nav>
            
            <Dropdown className="ms-auto">
              <Dropdown.Toggle variant="ghostSecondary" id="dropdown-basic">
                {currentUser && currentUser.name
                  ? currentUser.name
                  : "Laddar..."}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="/profile">
                  <FontAwesomeIcon icon={faUser} /> Min profil
                </Dropdown.Item>
                <Dropdown.Item href="/edit-profile">
                  <FontAwesomeIcon icon={faGear} /> Inställningar
                </Dropdown.Item>
                <Dropdown.Item href="/">
                  <FontAwesomeIcon icon={faRightFromBracket} /> Logga ut
                </Dropdown.Item>{" "}
                {/*LÄGG TILL RIKTIG FUNKTIONALITET - AVSLUTA SEKTION*/}
              </Dropdown.Menu>
            </Dropdown>
          
        </Container>
      </Navbar>

      <div style={{ minHeight: "calc(100vh - 100px)" }}>
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
