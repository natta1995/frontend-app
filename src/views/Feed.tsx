import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Form, Button, Dropdown } from "react-bootstrap";
import ProfileImg from "../Img/startimg.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faLeaf,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import Comments from "../components/Comments";
import { useUser } from "../UserContext";
import FriendSuggestions from "../components/MyFriendSuggestions";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

const BoxContainer = styled.div`
  padding: 5%;
  border-radius: 10px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.2);
  margin-bottom: 5%;
  background-color: #faedcd;
`;

const InputContainer = styled.div`
  padding: 5%;
  border-radius: 10px;
  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.2);
  margin-bottom: 2%;
  background-color: #faedcd;
`;

type Post = {
  id: number;
  username: string;
  content: string;
  createdAt: string;
  profile_image: string;
  image_url: string;
  likes: number[];
};

const Feed = () => {
  const { currentUser } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", newPost);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const response = await fetch("http://localhost:1337/feed/create", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        const createdPost: Post = await response.json();
        setPosts([createdPost, ...posts]);
        setNewPost("");
        setSelectedImage(null);
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

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    setNewPost((prev) => prev + emojiObject.emoji); // Lägg till emoji i texten
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleLikeToggle = async (feedId: number, isLiked: boolean) => {
    const method = isLiked ? "DELETE" : "POST"; 
    const url = `http://localhost:1337/feed/${feedId}/like`;
  
    
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === feedId
          ? {
              ...post,
              likes: isLiked
                ? post.likes.filter((id) => id !== currentUser?.id) 
                : [...post.likes, currentUser?.id ?? -1], 
            }
          : post
      )
    );
  
    try {
      const response = await fetch(url, {
        method,
        credentials: "include",
      });
  
      if (!response.ok) {
        console.error("Failed to toggle like");
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === feedId
              ? {
                  ...post,
                  likes: isLiked
                    ? [...post.likes, currentUser?.id ?? -1] 
                    : post.likes.filter((id) => id !== currentUser?.id), 
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Återställ likes till föregående tillstånd vid nätverksfel
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === feedId
            ? {
                ...post,
                likes: isLiked
                  ? [...post.likes, currentUser?.id ?? -1] // Återställ like
                  : post.likes.filter((id) => id !== currentUser?.id), // Återställ dislike
              }
            : post
        )
      );
    }
  };

  return (
    <div
      style={{ margin: "0 auto", padding: "3%", width: "70%", height: "auto" }}
    >
      <InputContainer>
        <Form onSubmit={handlePostSubmit}>
          <h1
            style={{
              textAlign: "center",
              paddingBottom: "15px",
              color: "#bc6c25",
            }}
          >
            Välkommen tillbaka {currentUser?.username} !{" "}
            <FontAwesomeIcon icon={faLeaf} />
          </h1>
          <div style={{ display: "flex", justifyContent: "column" }}>
            {currentUser ? (
              <img
                src={
                  currentUser.profile_image
                    ? `http://localhost:1337${currentUser.profile_image}`
                    : ProfileImg
                }
                alt="Profile"
                style={{
                  width: "70px",
                  height: "65px",
                  borderRadius: "50%",
                  marginRight: "10px",
                  paddingLeft: "0px",
                }}
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
                marginTop: "10px",
              }}
            />
          </div>
          <div>
            <Button
              type="button"
              onClick={toggleEmojiPicker}
              style={{
                padding: "7px",
                backgroundColor: "#bc6c25",
                borderColor: "#bc6c25",
                marginRight: "10px",
                marginLeft: "8%",
              }}
            >
              😊
            </Button>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginTop: "10px", marginBottom: "10px" }}
            />

            {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              style={{
                padding: "10px 20px",
                width: "30%",
                backgroundColor: "#bc6c25",
                borderColor: "#bc6c25",
                marginTop: "10px",
              }}
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
          posts.map((post) => {
            const likes = post.likes || []; // Om likes är undefined, blir det en tom array
            const isLikedByCurrentUser = likes.includes(currentUser?.id ?? -1);

            return (
              <BoxContainer key={post.id}>
                <div style={{ display: "flex" }}>
                  {post.username === currentUser?.username && (
                    <Dropdown className="ms-auto">
                      <Dropdown.Toggle
                        variant="ghostSecondary"
                        id="dropdown-basic"
                      >
                        <FontAwesomeIcon icon={faEllipsis} />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item>
                          <Button
                            onClick={() => handleDelete(post.id)}
                            variant="danger"
                          >
                            <FontAwesomeIcon icon={faTrashCan} /> Radera inlägg
                          </Button>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #ccc",
                    padding: "0px 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{width: "100%"}}>
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
                    <div
                      style={{
                        backgroundColor: "black",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                   
                      {post.image_url && (
                        <img
                          src={`http://localhost:1337${post.image_url}`}
                          alt="Inläggsbild"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "400px",
                            marginTop: "10px",
                          }}
                        />
                      )}
                      
                    </div>
                    <div>
                      <Button
                        onClick={() =>
                          handleLikeToggle(post.id, isLikedByCurrentUser)
                        }
                        style={{
                          padding: "10px",
                          backgroundColor: isLikedByCurrentUser
                            ? "#bc6c25"
                            : "#bc6c25",
                          borderColor: isLikedByCurrentUser ? "#bc6c25" : "#bc6c25",
                          marginTop: "10px",
                        }}
                      >
                        {isLikedByCurrentUser ? "❤️" : "❤️ Gilla"}
                      </Button>
                      <p style={{ marginTop: "5px", color: "#555" }}>
                        {post.likes?.length}{" "}
                        {post.likes?.length === 1
                          ? "person gillar detta"
                          : "personer gillar detta"}
                      </p>
                    </div>

                    <p style={{ fontSize: "0.8em", color: "#555" }}>
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Comments postId={post.id} />
              </BoxContainer>
            );
          })
        ) : (
          <p>Inga inlägg tillgängliga.</p>
        )}
      </div>
    </div>
  );
};
export default Feed;
