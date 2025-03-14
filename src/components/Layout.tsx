import React, { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LogoImg from "../Img/deer.webp";
import ProfileImg from "../Img/startimg.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/dropdown.css";
import {
  faHouse,
  faUserGroup,
  faGear,
  faRightFromBracket,
  faUser,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";

const Layout: React.FC = () => {
  const { currentUser, setCurrentUser } = useUser();
  const [users, setUsers] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:1337/users/userslist", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          setError("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error fetching users");
      }
    };

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

    fetchUsers();

    fetchPendingRequests();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:1337/users/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setCurrentUser(null);
        localStorage.clear();
        navigate("/");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Navbar
        style={{
          backgroundColor: "#ccd5ae",
          height: "70px",
          boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.4)",
        }}
      >
        <Container>
          <Navbar.Brand
            href="/feed"
            className="d-flex align-items-center"
            style={{ color: "#bc6c25" }}
          >
            <img
              src={LogoImg}
              alt="Logo"
              width="30"
              height="30"
              className="d-inline-block align-top me-2"
            />
            DearFriends
          </Navbar.Brand>

          <div>
            <input
              style={{ width: "300px" }}
              placeholder="Sök efter användare"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
           

            {searchQuery && (
              <div
                style={{
                  position: "absolute",
                  background: "white",
                  width: "300px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                }}
              >
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => {
                      setSearchQuery("");
                      navigate(`/profile/${user.username}`);
                    }}
                      style={{
                        padding: "10px",
                        cursor: "pointer",
                        borderBottom: "1px solid #ccc",
                      }}
                    >
                      {user.name}
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "10px" }}>Inga användare hittades</div>
                )}
              </div>
            )}
          </div>

          <Nav className="me-auto">
            <Nav.Link href="/feed">
              <FontAwesomeIcon
                icon={faHouse}
                style={{
                  height: "22px",
                  marginRight: "30px",
                  marginLeft: "200px",
                }}
              />
            </Nav.Link>
            <Nav.Link href="/find-friends" style={{ position: "relative" }}>
              <FontAwesomeIcon
                icon={faUserGroup}
                style={{ height: "22px", marginRight: "30px" }}
              />
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
            <Nav.Link href="/messages">
              <FontAwesomeIcon icon={faMessage} style={{ height: "22px" }} />
            </Nav.Link>
          </Nav>

          <Dropdown className="ms-auto">
            <Dropdown.Toggle variant="ghostSecondary" id="dropdown-basic">
              {currentUser ? (
                <img
                  src={
                    currentUser.profile_image
                      ? `http://localhost:1337${currentUser.profile_image}`
                      : ProfileImg
                  }
                  alt="Profile"
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
              ) : (
                "Laddar..."
              )}
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ backgroundColor: "#fefae0" }}>
              <Dropdown.Item href="/profile">
                <FontAwesomeIcon icon={faUser} /> {currentUser?.name}
              </Dropdown.Item>
              <Dropdown.Item href="/edit-profile">
                <FontAwesomeIcon icon={faGear} /> Inställningar
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>
                <FontAwesomeIcon icon={faRightFromBracket} /> Logga ut
              </Dropdown.Item>{" "}
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Navbar>

      <div style={{ minHeight: "calc(100vh - 100px)" }}>
        <Outlet />
      </div>

      <footer
        className="text-center py-3"
        style={{ backgroundColor: "#faedcd" }}
      >
        <Container>
          <p>© 2024 DearFriends. All rights reserved.</p>
        </Container>
      </footer>
    </>
  );
};

export default Layout;
