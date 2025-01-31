import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useUser } from "../UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileImg from "../Img/startimg.webp";
import MyFriendSuggestions from "../components/MyFriendSuggestions";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  faUserPlus,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const FriendContainer = styled.div`
  width: 100%;
  padding: 5%;
  border-radius: 10px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.2);
  background-color: #faedcd;
  
`;


const FindNewFriends: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const { currentUser } = useUser();
  const [friends, setFriends] = useState<any[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
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
        width: "64%",
        marginTop: "4%",
        marginBottom: "4%",
      }}
    >
     
      <MyFriendSuggestions />
      <div style={{ display: "flex", flexDirection: "row"}}>  
        <FriendContainer >
        <div>
        <h4>Vänförfrågningar</h4>
         
         <ul>
           {receivedRequests.length > 0 ? (
             receivedRequests.map((request) => (
               <li
               style={{ marginBottom: "5%", listStyle: "none", cursor: "pointer", backgroundColor: "#fefae0", padding: "20px", width: "95%",  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "10px",  display: "flex", 
                alignItems: "center", // Vertikal centrerad
                justifyContent: "space-between", }}
                 key={request.id}
               >
                <div>
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
                 </div>
                <div>
                 <Button
                   onClick={() => respondToRequest(request.id, "accept")}
                   style={{ marginLeft: "10px", backgroundColor: "#606c38", borderColor: "#606c38" }}
                   variant="success"
                 >
                   <FontAwesomeIcon icon={faCheck} />
                 </Button>
                 <Button
                   onClick={() => respondToRequest(request.id, "reject")}
                   style={{ marginLeft: "10px",backgroundColor: "#d62828", borderColor: "#d62828"   }}
                   variant="danger"
                 >
                   <FontAwesomeIcon icon={faXmark} />
                 </Button>
                 </div>
               </li>
             ))
           ) : (
             <li style={{ listStyle: "none" }}>
               Du har inga väntade vänförfrågningar just nu.
             </li>
           )}
         </ul>
        </div>





        <h4>Hitta och lägg till nya vänner !</h4>
        <div style={{ height: "800px", overflowY: "auto", padding: "1px" }}>
          <ul>
            {filteredUsers.map((user) => (
              <li
                style={{ marginBottom: "5%", listStyle: "none", cursor: "pointer", backgroundColor: "#fefae0", padding: "20px", width: "95%",  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "10px",  display: "flex", 
                  alignItems: "center", // Vertikal centrerad
                  justifyContent: "space-between", }}
                key={user.id}
                onClick={() => navigate(`/profile/${user.username}`)}
              >
                <div>
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
                </div>
                {sentRequests.includes(user.id) ? (
                  <span style={{ marginLeft: "10px", color: "green" }}>
                    Skickad
                  </span>
                ) : (
                  
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      sendFriendRequest(user.id) 
                    }} 
                    style={{ marginLeft: "10px", backgroundColor: "#606c38",
                      borderColor: "#606c38"}}
                  >
                    <FontAwesomeIcon icon={faUserPlus} /> Lägg till vän <br/>
                  </Button>
                  
                )}
                
              </li>
            ))}
          </ul>
          </div>



        </FriendContainer>
        
      </div>
    </div>
  );
};

export default FindNewFriends;