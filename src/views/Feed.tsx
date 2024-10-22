import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import ProfileImg from "../Img/startimg.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faLeaf, faL } from "@fortawesome/free-solid-svg-icons";
import Comments from "../components/Comments";
import { useUser } from "../UserContext";
import FriendSuggestions from "../components/MyFriendSuggestions"

const BoxContainer = styled.div`
  padding: 5%;
  border-radius: 10px;
  border: 1px solid #d4a373;
  margin-bottom: 5%;
  background-color: #faedcd;
`;

const InputContainer = styled.div`
  padding: 5%;
  border-radius: 10px;
  border: 1px solid #d4a373;
  margin-bottom: 2%;
  background-color: #faedcd;
`;

type Post = {
  id: number;
  username: string;
  content: string;
  createdAt: string;
  profile_image: string;
};

const Feed = () => {
  const { currentUser } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<string>("");
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPosts();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:1337/feed/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content: newPost }),
      });

      if (response.ok) {
        const createdPost: Post = await response.json();
        setPosts([createdPost, ...posts]);
        setNewPost("");
      } else {
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
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
    <div
      style={{ margin: "0 auto", padding: "3%", width: "70%", height: "auto" }}
    >
      <InputContainer>
        <Form onSubmit={handlePostSubmit}>
          <h1 style={{ textAlign: "center", paddingBottom: "15px", color: "#bc6c25" }}>
            Välkommen tillbaka {currentUser?.username} ! <FontAwesomeIcon icon={faLeaf} />
          </h1>
        <div style={{ display: "flex", justifyContent: "column"}}>
          {currentUser ? (
                <img
                  src={
                    currentUser.profile_image
                      ? `http://localhost:1337${currentUser.profile_image}`
                      : ProfileImg
                  }
                  alt="Profile"
                  style={{ width: "70px", height: "70px", borderRadius: "50%", marginRight: "10px" }}
                />
              ) : (
                "Laddar..."
              )}
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Vad vill du dela idag?"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              height: "50px",
              marginTop: "10px"
            }}
          />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              style={{ padding: "10px 20px", width: "30%", backgroundColor: "#bc6c25", borderColor: "#bc6c25", marginTop: "10px"}}
            >
              Publicera Inlägg
            </Button>
          </div>
        </Form>
      </InputContainer>
      <div>
        <FriendSuggestions />
      </div>

      <div style={{ marginTop: "20px" }}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <BoxContainer key={post.id}>
              <div
                style={{
                  borderBottom: "1px solid #ccc",
                  padding: "10px 0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h5>
                    <strong
                      onClick={() => navigate(`/profile/${post.username}`)}
                    >
                      <img
                        src={
                          post.profile_image
                            ? `http://localhost:1337${post.profile_image}`
                            : ProfileImg
                        }
                        alt={`${post.username}s profile`}
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                          marginRight: "10px",
                        }}
                      />
                      {post.username}
                    </strong>{" "}
                  </h5>
                  <p>{post.content}</p>
                  <p style={{ fontSize: "0.8em", color: "#555" }}>
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
                {post.username === currentUser?.username && (
                  <Button
                    onClick={() => handleDelete(post.id)}
                    variant="danger"
                  >
                    <FontAwesomeIcon icon={faTrashCan} />{" "}
                  </Button>
                )}
              </div>
            <Comments postId={post.id} />
            </BoxContainer>
          ))
        ) : (
          <p>Inga inlägg tillgängliga.</p>
        )}
      </div>
    </div>
  );
};

export default Feed;
