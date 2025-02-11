import { useState, useEffect, useRef } from "react";
import { useUser } from "../UserContext";
import { io } from "socket.io-client";

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
  const [newMessage, setNewMessage] = useState<string>("");
  const socketRef = useRef(io("http://localhost:1337"));

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

  const sendMessage = () => {
    if (!newMessage.trim() || !currentUser || !selectedFriend) return;

    const messageData = {
      sender_id: currentUser.id,
      receiver_id: selectedFriend,
      message_text: newMessage,
    };

    socketRef.current.emit("sendMessage", messageData);
    setNewMessage("");
  };


  useEffect(() => {
    const socket = socketRef.current;

    socket.on("receiveMessage", (newMessage) => {
        setMessages((prev) => {
            // 🔥 Om meddelandet redan finns, lägg inte till det igen
            if (!prev.some(msg => msg.id === newMessage.id)) {
                return [...prev, newMessage];
            }
            return prev;
        });
    });

    return () => {
        socket.off("receiveMessage");
    };
}, []);


  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Vänsterpanel - Lista med vänner */}
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

      {/* Högerpanel - Chatten */}
      <div
        style={{
          width: "70%",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
                flex: 1,
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
                    {msg.message_text} <br></br>({msg.status}) <br></br>(
                    {msg.created_at})
                  </p>
                ))
              ) : (
                <p>Inga meddelanden än.</p>
              )}
            </div>
            {/* Inputfält & Skicka-knapp */}
            <div style={{ display: "flex", marginTop: "10px" }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Skriv ett meddelande..."
                style={{ flex: 1, padding: "5px" }}
              />
              <button
                onClick={sendMessage}
                style={{ marginLeft: "5px", padding: "5px 10px" }}
              >
                Skicka
              </button>
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
