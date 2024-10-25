import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ProfileImg from "../Img/startimg.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup, faUserSlash } from "@fortawesome/free-solid-svg-icons";

const MyFriends = () => {
  const [show, setShow] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch("http://localhost:1337/friends/list", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setFriends(data);
        } else {
          setError("Failed to fetch friends");
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
        setError("Error fetching friends");
      }
    };

    fetchFriends();
  }, []);

  const removeFriend = async (friendId: number) => {
    try {
      const response = await fetch("http://localhost:1337/friends/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ friendId }),
      });

      if (response.ok) {
        setFriends(friends.filter((friend) => friend.id !== friendId));
      } else {
        setError("Failed to remove friend");
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      setError("Error removing friend");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Button variant="primary" style={{backgroundColor: "#606c38", borderColor: "#606c38"}} onClick={handleShow}>
        <FontAwesomeIcon icon={faUserGroup} /> Vänner
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>Vänner</Modal.Header>
        <Modal.Body>
          <div style={{ height: "400px", overflowY: "auto", padding: "1px" }}>
            <ul style={{ padding: 0 }}>
              {friends.map((friend) => (
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                    listStyle: "none",
                    padding: "10px",
                    borderBottom: "1px solid #ddd",
                  }}
                  key={friend.id}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      flex: 1,
                    }}
                    onClick={() => navigate(`/profile/${friend.username}`)}
                  >
                    <img
                      src={
                        friend.profile_image
                          ? `http://localhost:1337${friend.profile_image}`
                          : ProfileImg
                      }
                      alt={`${friend.username}s profile`}
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
                    />
                    <div>
                      <strong>{friend.name}</strong> <br /> ({friend.username})
                    </div>
                  </div>
                  <Button
                    onClick={() => removeFriend(friend.id)}
                    style={{ marginLeft: "10px" }}
                    variant="danger"
                  >
                    <FontAwesomeIcon icon={faUserSlash} />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Stäng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default MyFriends;
