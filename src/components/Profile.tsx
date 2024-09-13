import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown } from "react-bootstrap";
import ProfileImg from "../startimg.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGears,
  faUserGroup,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

const ProfileContainer = styled.div`
  padding: 10%;
  border-radius: 10px;
  border: 1px solid #d3efe5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
`;

type Post = {
  id: number;
  username: string;
  content: string;
  createdAt: string;
};

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:1337/users/profile", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          setError("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Error fetching profile");
      }
    };

    const fetchPosts = async () => {
      try {
        // Hämta inlägg
        const response = await fetch("http://localhost:1337/feed", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          console.error("Failed to fetch posts");
        }

        // Hämta nuvarande användares username
        const userResponse = await fetch(
          "http://localhost:1337/users/profile",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setCurrentUser(userData.username); // Sätt användarnamnet i state
        } else {
          console.error("Failed to fetch current user");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

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

    fetchPosts();
    fetchProfile();
    fetchFriends();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  const removeFriend = async (friendId: number) => {
    try {
      const response = await fetch("http://localhost:1337/friends/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ friendId }),
      });

      if (response.ok) {
        setFriends(friends.filter((friend) => friend.id !== friendId));
      } else {
        setError("Failed to remove friend");
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      setError("Error removing friend");
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      const response = await fetch(`http://localhost:1337/feed/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== postId));
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <ProfileContainer style={{ width: "70%", margin: "0 auto" }}>
      <img
        src={ProfileImg}
        alt="StartProfileImg"
        style={{ width: "250px", height: "auto", borderRadius: "50%" }}
      />
      <h1>{profile.name}</h1>
      <p>
        <strong>Användarnamn:</strong> {profile.username}
      </p>
      <p>
        <strong>Namn:</strong> {profile.name}
      </p>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>Ålder:</strong> {profile.age}
      </p>
      <p>
        <strong>Arbetsplats:</strong> {profile.workplace}
      </p>
      <p>
        <strong>Skola:</strong> {profile.school}
      </p>
      <p>
        <strong>Bio:</strong> {profile.bio}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={() => navigate("/edit-profile")}>
          <FontAwesomeIcon icon={faGears} />
        </Button>
        <Dropdown className="ms-auto">
          <Dropdown.Toggle variant="ghostSecondary" id="dropdown-basic">
            {" "}
            <FontAwesomeIcon icon={faUserGroup} /> Vänner
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item>
              <ul>
                {friends.map((friend) => (
                  <li
                    style={{ marginBottom: "5%", listStyle: "none" }}
                    key={friend.id}
                  >
                    {friend.name} ({friend.username})
                    <Button
                      onClick={() => removeFriend(friend.id)}
                      style={{ marginLeft: "10px" }}
                      variant="danger"
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </Button>
                  </li>
                ))}
              </ul>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div style={{ paddingTop: "8%" }}>
        <h3 style={{ borderTop: "1px solid #ccc", padding: "10px 0" }}>
          Mina inlägg:
        </h3>
        {posts.length > 0 ? (
          posts
            .filter((post) => post.username === currentUser)
            .map((post) => (
              <div
                key={post.id}
                style={{
                  borderBottom: "1px solid #ccc",
                  padding: "10px 0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p>
                    <strong>{post.username}</strong> säger:
                  </p>
                  <p>{post.content}</p>
                  <p style={{ fontSize: "0.8em", color: "#555" }}>
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Button
                    onClick={() => handleDelete(post.id)}
                    variant="danger"
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </Button>
                </div>
              </div>
            ))
        ) : (
          <p>Du har inte gjort några inlägg ännu.</p>
        )}
      </div>
    </ProfileContainer>
  );
};

export default Profile;
