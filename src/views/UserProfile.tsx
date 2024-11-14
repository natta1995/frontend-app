import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileImg from "../Img/startimg.webp";
import BackgroundImg from "../Img/forestimg.jpg";
import styled from "styled-components";
import Comments from "../components/Comments";

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
  width: 180px;
  height: 180px;
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
  image_url: string;
};

const UserProfile: React.FC = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:1337/users/profile/${username}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        setProfile(data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:1337/feed", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setPosts(data.filter((post: Post) => post.username === username));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const fetchData = async () => {
      await fetchProfile();
      await fetchPosts();
    };

    fetchData();
  }, [username]);

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
              profile && profile.profile_image
                ? `http://localhost:1337${profile.profile_image}`
                : ProfileImg
            }
            alt={`${profile?.username}s profile`}
          />
        </BackgroundWrapper>
        <div style={{ marginTop: "10%", marginLeft: "5%" }}>
          <h1>{profile?.name}</h1>

          <p>
            <strong>Användarnamn:</strong> {profile?.username}
          </p>
          <p>
            <strong>Namn:</strong> {profile?.name}
          </p>
          <p>
            <strong>Email:</strong> {profile?.email}
          </p>
          <p>
            <strong>Ålder:</strong> {profile?.age}
          </p>
          <p>
            <strong>Arbetsplats:</strong> {profile?.workplace}
          </p>
          <p>
            <strong>Skola:</strong> {profile?.school}
          </p>
          <p>
            <strong>Bio:</strong> {profile?.bio}
          </p>
        </div>
      </ProfileContainer>
      <div
        style={{
          paddingTop: "4%",

          marginTop: "4%",
          marginBottom: "0.5%",
        }}
      >
        {posts.map((post) => (
          <BoxContainer key={post.id}>
            <PostContainer>
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
              <p>{post.content}</p>
              <p style={{ fontSize: "0.8em", color: "#555" }}>
                {new Date(post.createdAt).toLocaleString()}
              </p>
              <Comments postId={post.id} />
            </PostContainer>
          </BoxContainer>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
