import { useState, useEffect } from "react";
import { useUser } from "../UserContext";

const MyMessages = () => {
  const { currentUser } = useUser();
  const [selectedFriend, setSelectedFriend] = useState<number | null>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    {
      id: number;
      sender_id: number;
      message_text: string;
      created_at: string;
      status: "sent" | "delivered" | "read";
    }[]
  >([]);

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

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedFriend && currentUser) {
        try {
          const response = await fetch(
            `http://localhost:1337/messages/chat/${currentUser.id}/${selectedFriend}`
          );
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error("Fel vid hämtning av meddelanden:", error);
        }
      }
    };
    fetchMessages();
  }, [selectedFriend, currentUser]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div
        style={{ width: "30%", borderRight: "1px solid #ccc", padding: "10px" }}
      >
        <h2>Vänner</h2>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div
              key={friend.id}
              style={{
                padding: "10px",
                cursor: "pointer",
                background: selectedFriend === friend.id ? "#ddd" : "#fff",
              }}
              onClick={() => setSelectedFriend(friend.id)}
            >
              {friend.name}
            </div>
          ))
        ) : (
          <p>Laddar vänner...</p>
        )}
      </div>

      <div style={{ width: "70%", padding: "10px" }}>
        <h2>Chatt</h2>
        {selectedFriend ? (
          <>
            <p>
              Chatten med {friends.find((f) => f.id === selectedFriend)?.name}:
            </p>
            <div
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                height: "300px",
                overflowY: "auto",
              }}
            >
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <p
                    key={msg.id}
                    style={{
                      textAlign:
                        msg.sender_id === currentUser?.id ? "right" : "left",
                      background:
                        msg.sender_id === currentUser?.id ? "#dcf8c6" : "#fff",
                      padding: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    {msg.message_text} <br></br>
                    {msg.created_at} <br></br>
                    {msg.status}
                  </p>
                ))
              ) : (
                <p>Inga meddelanden än.</p>
              )}
            </div>
          </>
        ) : (
          <p>Välj en vän till vänster för att se chatten.</p>
        )}
      </div>
    </div>
  );
};

export default MyMessages;
