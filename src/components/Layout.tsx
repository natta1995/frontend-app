import React, { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import {
  Navbar,
  Nav,
  Container,
  Dropdown,
  Form,
  FormControl,
} from "react-bootstrap";
import { Outlet } from "react-router-dom";
import LogoImg from "../deer.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileImg from "../startimg.webp";
import {
  faHouse,
  faUserGroup,
  faGear,
  faRightFromBracket,
  faUser,
  faHeart
} from "@fortawesome/free-solid-svg-icons";

const Layout: React.FC = () => {
  const { currentUser } = useUser();
  const [users, setUsers] = useState([]); // Håll koll på alla användare
  const [searchQuery, setSearchQuery] = useState(""); // Håll koll på sökfrågan
  const [filteredUsers, setFilteredUsers] = useState([]); // Håll koll på filtrerade användare baserat på sökfrågan
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:1337/users/userslist", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data); // Sätt alla användare i state
          setFilteredUsers(data); // Sätt även filtrerade användare som standard till alla användare
        } else {
          setError("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error fetching users");
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredUsers(
        users.filter(
          (user: any) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredUsers([]);
    }
  }, [searchQuery, users]);

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
              <Nav.Link href="/feed">
                <FontAwesomeIcon icon={faHouse} />
              </Nav.Link>
              <Nav.Link href="/find-friends">
                <FontAwesomeIcon icon={faUserGroup} />
              </Nav.Link>
              <Nav.Link href="/my-friends">
                <FontAwesomeIcon icon={faHeart} />
              </Nav.Link>
            </Nav>

            <Form style={{ width: "60%" }} className="d-flex">
              <FormControl
                type="search"
                placeholder="Sök efter användare"
                className="me-2"
                aria-label="Sök"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form>

            {filteredUsers.length === 0 && searchQuery && (
              <p>Inga användare hittades</p>
            )}
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
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div>
        {filteredUsers.length > 0 && (
          <div style={{ padding: "20px" }}>
            <ul>
              {filteredUsers.map((user: any) => (
                <li style={{ listStyle: "none" }} key={user.id}>
                  <a href={`/profile/${user.username}`}>
                    {" "}
                    <img
                      src={ProfileImg}
                      alt="StartProfileImg"
                      style={{
                        width: "40px",
                        height: "auto",
                        borderRadius: "50%",
                      }}
                    />{" "}
                    {user.name} ({user.username})
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

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
