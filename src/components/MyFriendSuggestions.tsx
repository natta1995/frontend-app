import { useUser } from "../UserContext";
import { styled } from "styled-components";
import { useState, useEffect} from "react";
import ProfileImg from "../Img/startimg.webp"
import { Card } from "react-bootstrap"

const BoxContainer = styled.div`
  padding: 1%;
  paddingLeft: -6%;
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

  useEffect(() => {
    if (friends.length > 0 && users.length > 0) {

      const friendIds = friends.map((friend) => friend.id); 
      const nonFriends = users.filter((user) => !friendIds.includes(user.id));

      
      const randomUsers = nonFriends
        .sort(() => 0.5 - Math.random()) 
        .slice(0, 5);

      setSuggestedUsers(randomUsers);
    }
  }, [friends, users]);



    return ( 
        <BoxContainer>
        {error && <p>{error}</p>}
        <ul style={{margin: "10px", padding: "10px"}}>
            <h6>Vänförslag - du kanske också känner?</h6>
        <div style={{display: "flex",  justifyContent: "space-between", flexWrap: "wrap", marginLeft: "5px"}}>
          {suggestedUsers.map((user) => (
            
            <Card key={user.id} style={{listStyle: "none", padding: "1%", alignItems: "center", backgroundColor: "#fefae0"}}>
                <img
                        src={
                          user.profile_image
                            ? `http://localhost:1337${user.profile_image}`
                            : ProfileImg
                        }
                        alt={`${user.username}s profile`}
                        style={{
                          width: "100px",
                          height: "100px"
                        }}
                      />
            <div style={{ textAlign: "center"}}>
              {user.name} 
              </div>
            </Card>
          
          ))}
            </div>
        </ul>
      </BoxContainer>
    )

}

export default FriendSuggestions;