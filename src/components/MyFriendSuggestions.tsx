import { useUser } from "../UserContext";
import { styled } from "styled-components";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import ProfileImg from "../Img/startimg.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "react-bootstrap";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const BoxContainer = styled.div`
  padding: 1%;
  paddingleft: -6%;
  border-radius: 10px;
  border: 1px solid #d4a373;
  margin-bottom: 2%;
  background-color: #faedcd;
  margin-right: 15px;
  width: 100%;
`;

const FriendSuggestions = () => {
  const { currentUser } = useUser();
  const [friends, setFriends] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

    fetchFriends();
    fetchUsers();
  }, []);

  const sendFriendRequest = async (friendId: number) => {
    try {
      const response = await fetch("http://localhost:1337/friends/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ friendId }),
      });

      if (response.ok) {
        setSentRequests([...sentRequests, friendId]);
      } else {
        setError("Failed to send friend request");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      setError("Error sending friend request");
    }
  };

  useEffect(() => {
    if (currentUser && friends.length > 0 && users.length > 0) {
      const friendIds = friends.map((friend) => friend.id);
      const nonFriends = users.filter(
        (user) => !friendIds.includes(user.id) && user.id !== currentUser.id
      );

      const randomUsers = nonFriends
        .sort(() => 0.4 - Math.random())
        .slice(0, 4);

      setSuggestedUsers(randomUsers);
    }
  }, [friends, users, currentUser]);

  return (
    <BoxContainer>
      {error && <p>{error}</p>}
      <ul style={{ margin: "10px", padding: "10px" }}>
        <h6>Vänförslag - du kanske också känner?</h6>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            marginLeft: "5px",
          }}
        >
          {suggestedUsers.map((user) => (
            <Card
              key={user.id}
              style={{
                listStyle: "none",
                padding: "2%",
                alignItems: "center",
                backgroundColor: "#fefae0",
                cursor: "pointer",
                margin: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s",
                width: "180px",
                borderRadius: "10px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)"; // Zooma in kortet lite vid hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"; // Återställ vid hover-out
              }}
              onClick={() => navigate(`/profile/${user.username}`)}
            >
              <img
                src={
                  user.profile_image
                    ? `http://localhost:1337${user.profile_image}`
                    : ProfileImg
                }
                alt={`${user.username}s profile`}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div style={{ textAlign: "center" }}>
                {user.name}
                <div>
                  {sentRequests.includes(user.id) ? (
                    <span style={{ marginLeft: "10px", color: "green" }}>
                      Skickad
                    </span>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        sendFriendRequest(user.id);
                      }}
                      style={{ marginLeft: "10px" }}
                    >
                      <FontAwesomeIcon icon={faUserPlus} />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ul>
    </BoxContainer>
  );
};

export default FriendSuggestions;
