import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileImg from "../startimg.webp";
import styled from "styled-components";

const ProfileContainer = styled.div`
  padding: 10%;
  padding-top: 5%;
  border-radius: 10px;
  border: 1px solid #d3efe5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  background-color:  #f3f4e3;
`;

type Post = {
  id: number;
  username: string;
  content: string;
  createdAt: string;
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
    <div>
      <ProfileContainer style={{ width: "70%", margin: "0 auto", marginTop: "30px", marginBottom: "30px" }}>
      <img
         src={profile && profile.profile_image ? `http://localhost:1337${profile.profile_image}` : ProfileImg}
         alt="Profile Image"
         style={{ width: "250px", height: "250px", borderRadius: "50%" }}
      />
        <h1 style={{ paddingTop: "8%" }}>{profile?.name}</h1>
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

        <h3>Mina vänner:</h3>

        {posts.map((post) => (
          <div
            key={post.id}
            style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}
          >
            <p>
              <strong>{post.username}</strong> säger:
            </p>
            <p>{post.content}</p>
          </div>
        ))}
      </ProfileContainer>
    </div>
  );
};

export default UserProfile;
