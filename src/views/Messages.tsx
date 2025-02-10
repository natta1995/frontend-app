import { useState, useEffect } from "react";

const MyMessages = () => {
  const [selectedFriend, setSelectedFriend] = useState<number | null>(null);
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
          <p>
            Chatten med {friends.find((f) => f.id === selectedFriend)?.name}{" "}
            visas här.
          </p>
        ) : (
          <p>Välj en vän till vänster för att se chatten.</p>
        )}
      </div>
    </div>
  );
};

export default MyMessages;
