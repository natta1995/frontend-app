import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useUser } from "../UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileImg from "../Img/startimg.webp";
import styled from "styled-components";
import {
  faUserPlus,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const FriendContainer = styled.div`
  width: 50%;
  padding: 5%;
  border-radius: 10px;
  border: 1px solid #d3efe5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  background-color: #f3f4e3;
`;


const FindNewFriends: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const { currentUser } = useUser();
  const [friends] = useState<any[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<number[]>([]);
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
          setUsers(data);
        } else {
          setError("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error fetching users");
      }
    };

    const fetchReceivedRequests = async () => {
      try {
        const response = await fetch("http://localhost:1337/friends/requests", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setReceivedRequests(data);
        } else {
          setError("Failed to fetch received friend requests");
        }
      } catch (error) {
        console.error("Error fetching received requests:", error);
        setError("Error fetching received requests");
      }
    };

    fetchUsers();

    fetchReceivedRequests();
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

  const respondToRequest = async (
    requestId: number,
    action: "accept" | "reject"
  ) => {
    try {
      const response = await fetch("http://localhost:1337/friends/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ requestId, action }),
      });

      if (response.ok) {
        setReceivedRequests(
          receivedRequests.filter((req) => req.id !== requestId)
        );
      } else {
        setError("Failed to respond to friend request");
      }
    } catch (error) {
      console.error("Error responding to friend request:", error);
      setError("Error responding to friend request");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  const filteredUsers = users.filter(
    (user) =>
      !friends.some((friends) => friends.id === user.id) &&
      user.id !== currentUser?.id
  );

  return (
    <div
      style={{
        margin: "0 auto",
        width: "80%",
        marginTop: "4%",
        marginBottom: "4%",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row"}}>  
        <FriendContainer >
          <h2>Hitta nya vänner !</h2>
          <ul>
            {filteredUsers.map((user) => (
              <li
                style={{ marginBottom: "5%", listStyle: "none" }}
                key={user.id}
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
                          marginRight: "10px",
                        }}
                      />
                {user.name} ({user.username})
                {sentRequests.includes(user.id) ? (
                  <span style={{ marginLeft: "10px", color: "green" }}>
                    Skickad
                  </span>
                ) : (
                  <Button
                    onClick={() => sendFriendRequest(user.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    <FontAwesomeIcon icon={faUserPlus} />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </FriendContainer>
        <FriendContainer >
          <h2>Mottagna Vänförfrågningar</h2>
          <ul>
            {receivedRequests.length > 0 ? (
              receivedRequests.map((request) => (
                <li
                  style={{ marginBottom: "5%", listStyle: "none" }}
                  key={request.id}
                >
                      <img
                        src={
                          request.profile_image
                            ? `http://localhost:1337${request.profile_image}`
                            : ProfileImg
                        }
                        alt={`${request.username}s profile`}
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                          marginRight: "10px",
                        }}
                      />
                  {request.name} ({request.username})
                  <Button
                    onClick={() => respondToRequest(request.id, "accept")}
                    style={{ marginLeft: "10px" }}
                    variant="success"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </Button>
                  <Button
                    onClick={() => respondToRequest(request.id, "reject")}
                    style={{ marginLeft: "10px" }}
                    variant="danger"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </Button>
                </li>
              ))
            ) : (
              <li style={{ listStyle: "none" }}>
                Du har inga väntade vänförfrågningar just nu.
              </li>
            )}
          </ul>
          </FriendContainer>
      </div>
    </div>
  );
};

export default FindNewFriends;