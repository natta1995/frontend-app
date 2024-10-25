import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Dropdown } from "react-bootstrap";
import ProfileImg from "../Img/startimg.webp";
import BackgroundImg from "../Img/forestimg.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Comments from "../components/Comments";
import { useUser } from "../UserContext";
import MyFriends from "../components/MyFriends";
import ProfileEdit from "../components/ProfileEdit";
import { faTrashCan, faEllipsis } from "@fortawesome/free-solid-svg-icons";

const BackgroundWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PostContainer = styled.div`
  padding: 5%;
  border-radius: 10px;
  border: 1px solid #d3efe5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  margin-bottom: 5%;
  background-color: #faedcd;
`;

const BackgroundContainer = styled.div`
  width: 100%;
  height: 300px;
  background-image: url(${BackgroundImg});
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 10px 10px 10px 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  margin-top: 5%;
`;

const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 5px solid white;
  position: absolute;
  bottom: -55px;
  left: 20%;
  transform: translateX(-70%);
`;

const ProfileContainer = styled.div`
  padding: 5%;
  padding-top: 1%;
  border-radius: 10px;
  border: 1px solid #d3efe5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  background-color: #faedcd;
  margin-top: 5px;
`;

const BoxContainer = styled.div`
  border-radius: 10px;
  margin-bottom: 5%;
  background-color: #f3f4e3;
`;

type Post = {
  id: number;
  username: string;
  content: string;
  createdAt: string;
  profile_image: string;
};

const Profile: React.FC = () => {
  const { currentUser } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

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

  if (!currentUser) {
    return <div>Loading...</div>;
  }

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
      style={{
        width: "70%",
        margin: "0 auto",
        marginTop: "30px",
        marginBottom: "30px",
      }}
    >
      <ProfileContainer>
        <BackgroundWrapper>
          <BackgroundContainer />

          <ProfileImage
            src={
              currentUser.profile_image
                ? `http://localhost:1337${currentUser.profile_image}`
                : ProfileImg
            }
            alt="Profile Image"
          />
        </BackgroundWrapper>
        <div style={{ marginTop: "10%", marginLeft: "5%" }}>
          <h1>{currentUser.name}</h1>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <ProfileEdit />
          </div>
          <p>
            <strong>Användarnamn:</strong> {currentUser.username}
          </p>
          <p>
            <strong>Email:</strong> {currentUser.email}
          </p>
          <p>
            <strong>Ålder:</strong> {currentUser.age}
          </p>
          <p>
            <strong>Arbetsplats:</strong> {currentUser.workplace}
          </p>
          <p>
            <strong>Skola:</strong> {currentUser.school}
          </p>
          <p>
            <strong>Bio:</strong> {currentUser.bio}
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div>
              <MyFriends />
            </div>
          </div>
        </div>
      </ProfileContainer>

      <div
        style={{
          paddingTop: "2%",
          marginTop: "4%",
          marginBottom: "0.5%",
        }}
      >
        {posts.length > 0 ? (
          posts
            .filter((post) => post.username === currentUser.username)
            .map((post) => (
              <BoxContainer key={post.id}>
                <PostContainer>
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
                              <FontAwesomeIcon icon={faTrashCan} /> Radera
                              inlägg
                            </Button>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>

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
                  <p>
                    <strong>{post.username}</strong>
                  </p>

                  <p>{post.content}</p>
                  <p style={{ fontSize: "0.8em", color: "#555" }}>
                    {new Date(post.createdAt).toLocaleString()}
                  </p>

                  <div
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  ></div>

                  <Comments postId={post.id} />
                </PostContainer>
              </BoxContainer>
            ))
        ) : (
          <p>Du har inte gjort några inlägg ännu.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
