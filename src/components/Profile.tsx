import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import ProfileImg from "../Img/startimg.webp";
import BackgroundImg from "../Img/forestimg.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Comments from "./Comments";
import {
  faGears,
  faTrashCan,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";


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
  background-color: #f3f4e3;
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
  background-color: #f3f4e3;
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
  const [profile, setProfile] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
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

        const userResponse = await fetch(
          "http://localhost:1337/users/profile",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setCurrentUser(userData.username);
        } else {
          console.error("Failed to fetch current user");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPosts();
    fetchProfile();
    
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
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
              profile.profile_image
                ? `http://localhost:1337${profile.profile_image}`
                : ProfileImg
            }
            alt="Profile Image"
          />
        </BackgroundWrapper>
        <div style={{ marginTop: "10%", marginLeft: "5%" }}>
          <h1>{profile.name}</h1>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="secondary"
              onClick={() => navigate("/edit-profile")}
            >
              <FontAwesomeIcon icon={faGears} />
            </Button>
          </div>
          <p>
            <strong>Användarnamn:</strong> {profile.username}
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
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div>
              <Link to="/my-friends">
                <Button>
                  {" "}
                  <FontAwesomeIcon icon={faUserGroup} /> Vänner{" "}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div style={{ paddingTop: "8%", borderTop: "2px solid #ccc", marginTop: "4%", marginBottom: "0.5%" }}>
         
          {posts.length > 0 ? (
            posts
              .filter((post) => post.username === currentUser)
              .map((post) => (
                <BoxContainer key={post.id}>
                  <PostContainer>
                    <img
                      src={
                        post.profile_image
                          ? `http://localhost:1337${post.profile_image}`
                          : ProfileImg
                      }
                      alt="Profile Image"
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
                  
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ marginTop: "-15%" }}>
                      <Button
                        onClick={() => handleDelete(post.id)}
                        variant="danger"
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </Button>
                    </div>
                  </div>
                 
                  <Comments postId={post.id} currentUser={currentUser} />
                  </PostContainer>
                </BoxContainer>
              ))
          ) : (
            <p>Du har inte gjort några inlägg ännu.</p>
          )}
        </div>
      </ProfileContainer>
    </div>
  );
};

export default Profile;
