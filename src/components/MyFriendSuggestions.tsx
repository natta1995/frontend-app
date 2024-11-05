import { useUser } from "../UserContext";
import { styled } from "styled-components";
import { Button, Carousel, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import ProfileImg from "../Img/startimg.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const BoxContainer = styled.div`
  padding: 1%;
  border-radius: 10px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.2);
  margin-bottom: 2%;
  background-color: #faedcd;
  width: 100%;

  @media (max-width: 768px) {
    padding: 2%;
  }

  @media (max-width: 480px) {
    padding: 5%;
  }
`;

// Styling for the carousel arrows
const StyledCarousel = styled(Carousel)`
  .carousel-control-prev,
  .carousel-control-next {
    width: 5%;
  }

  .carousel-control-prev-icon,
  .carousel-control-next-icon {
    background-color: #d4a373;
    border-radius: 50%;
    padding: 10px;
  }

  .carousel-control-prev {
    left: -60px; // Move left arrow further left
  }

  .carousel-control-next {
    right: -60px; // Move right arrow further right
  }
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
        .slice(0, 8);

      setSuggestedUsers(randomUsers);
    }
  }, [friends, users, currentUser]);

  const chunkedUsers = [];
  for (let i = 0; i < suggestedUsers.length; i += 4) {
    chunkedUsers.push(suggestedUsers.slice(i, i + 4));
  }

  return (
    <BoxContainer>
      {error && <p>{error}</p>}

      <StyledCarousel>
        {chunkedUsers.map((userGroup, index) => (
          <Carousel.Item key={index}>
            <div
              style={{
                display: "flex",
                gap: "5%",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {userGroup.map((user) => (
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
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
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
                  <div style={{ textAlign: "center", width: "180px" }}>
                    <strong>{user.name}</strong>
                    <br />
                    {user.username}
                    <div>
                      {sentRequests.includes(user.id) ? (
                        <span style={{ marginLeft: "10px", color: "#606c38" }}>
                          Vänförfrågan skickad
                        </span>
                      ) : (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation(); // Förhindrar att kortets onClick triggas
                            sendFriendRequest(user.id);
                          }}
                          style={{
                            marginLeft: "10px",
                            backgroundColor: "#606c38",
                            borderColor: "#606c38",
                          }}
                        >
                          <FontAwesomeIcon icon={faUserPlus} /> Lägg till vän
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </StyledCarousel>
    </BoxContainer>
  );
};

export default FriendSuggestions;
