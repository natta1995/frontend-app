import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileImg from "../Img/startimg.webp";
import {
  faUserSlash
} from "@fortawesome/free-solid-svg-icons";

const MyFriends: React.FC = () => {
  const [friends, setFriends] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

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
      const response = await fetch('http://localhost:1337/friends/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ friendId }),
      });

      if (response.ok) {
        setFriends(friends.filter(friend => friend.id !== friendId));
      } else {
        setError('Failed to remove friend');
      }
    } catch (error) {
      console.error('Error removing friend:', error);
      setError('Error removing friend');
    }
  };

  if (error) {
    return <div>{error}</div>;
  } 

 
  return (
    <div style={{ margin: "0 auto", width: "80%", backgroundColor: "#f3f4e3", marginTop: "4%", marginBottom: "4%", paddingBottom: "3%" }}>
        <h1 style={{textAlign: "center", padding: "2%", paddingBottom: "5%"}}>Mina Vänner</h1>
      <ul>
        {friends.map((friend) => (
          <li style={{marginBottom: "5%", listStyle: "none"}} key={friend.id}>
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
          <strong> {friend.name} </strong> ({friend.username})
            <Button onClick={() => removeFriend(friend.id)} style={{ marginLeft: '10px' }} variant="danger"> <FontAwesomeIcon icon={faUserSlash} /> </Button>
          </li>
        ))}
      </ul> 
        </div>
     
  );
};

export default MyFriends;