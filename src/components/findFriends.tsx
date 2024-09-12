import React, { useState, useEffect } from 'react';
import {Button} from 'react-bootstrap';

const Friends: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:1337/users/userslist', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          setError('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Error fetching users');
      }
    };

    const fetchFriends = async () => {
      try {
        const response = await fetch('http://localhost:1337/friends/list', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setFriends(data);
        } else {
          setError('Failed to fetch friends');
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
        setError('Error fetching friends');
      }
    };

    const fetchReceivedRequests = async () => {
      try {
        const response = await fetch('http://localhost:1337/friends/requests', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setReceivedRequests(data);
        } else {
          setError('Failed to fetch received friend requests');
        }
      } catch (error) {
        console.error('Error fetching received requests:', error);
        setError('Error fetching received requests');
      }
    };

    fetchUsers();
    fetchFriends();
    fetchReceivedRequests();
  }, []);

  const sendFriendRequest = async (friendId: number) => {
    try {
      const response = await fetch('http://localhost:1337/friends/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ friendId }),
      });

      if (response.ok) {
        setSentRequests([...sentRequests, friendId]);
      } else {
        setError('Failed to send friend request');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      setError('Error sending friend request');
    }
  };

  const respondToRequest = async (requestId: number, action: 'accept' | 'reject') => {
    try {
      const response = await fetch('http://localhost:1337/friends/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ requestId, action }),
      });

      if (response.ok) {
        setReceivedRequests(receivedRequests.filter(req => req.id !== requestId));
      } else {
        setError('Failed to respond to friend request');
      }
    } catch (error) {
      console.error('Error responding to friend request:', error);
      setError('Error responding to friend request');
    }
  };

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
    <div style={{ margin: '0 auto', padding: '20px', width: '80%' }}>
        <h1 style={{textAlign: "center", paddingBottom: "3%"}}>Hantera vänner</h1>
      <div style={{display: "flex", flexDirection: "row",}}>
      <div style={{width: "50%", padding: "5%", border: "solid 1px black"}}>
      <h2>Lägg Till Användare</h2>
      <ul>
        {users.map((user) => (
          <li style={{marginBottom: "5%", listStyle: "none"}} key={user.id}>
            {user.name} ({user.username})
            {sentRequests.includes(user.id) ? (
              <span style={{ marginLeft: '10px', color: 'green' }}>Skickad</span>
            ) : (
              <Button onClick={() => sendFriendRequest(user.id)} style={{ marginLeft: '10px' }} variant="success">Skicka vänförfrågan</Button>
            )}
          </li>
        ))}
      </ul>
      </div>
      <div style={{width: "50%", padding: "5%", border: "solid 1px black"}}>
      <h2>Mottagna Vänförfrågningar</h2>
      <ul>
        {receivedRequests.length > 0 ? (
          receivedRequests.map((request) => (
            <li style={{marginBottom: "5%", listStyle: "none"}} key={request.id}>
              {request.name} ({request.username})
              <Button onClick={() => respondToRequest(request.id, 'accept')} style={{ marginLeft: '10px' }} variant="success">Acceptera</Button>
              <Button onClick={() => respondToRequest(request.id, 'reject')} style={{ marginLeft: '10px' }} variant="danger">Avvisa</Button>
            </li>
          ))
        ) : (
          <li style={{listStyle: "none"}}>Du har inga väntade vänförfrågningar just nu.</li>
        )}
      </ul>

      <h2>Mina Vänner</h2>
      <ul>
        {friends.map((friend) => (
          <li style={{marginBottom: "5%", listStyle: "none"}} key={friend.id}>
            {friend.name} ({friend.username})
            <Button onClick={() => removeFriend(friend.id)} style={{ marginLeft: '10px' }} variant="danger">Ta bort vän</Button>
          </li>
        ))}
      </ul>
    </div>
    </div>
    </div>
  );
};

export default Friends;
