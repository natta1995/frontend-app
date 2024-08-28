import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate  } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const ProfileContainer = styled.div` 
  padding: 10%;
  border-radius: 10px;
  border: 1px solid #d3efe5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
`

type Post = {
  id: number;
  username: string;
  content: string;
  createdAt: string;
};

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]); 
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:1337/users/profile', {
          method: 'GET',
          credentials: 'include', 
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          setError('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Error fetching profile');
      }
    };

    const fetchPosts = async () => {
      try {
        // Hämta inlägg
        const response = await fetch('http://localhost:1337/feed', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          console.error('Failed to fetch posts');
        }

        // Hämta nuvarande användares username
        const userResponse = await fetch('http://localhost:1337/users/profile', {
          method: 'GET',
          credentials: 'include',
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setCurrentUser(userData.username); // Sätt användarnamnet i state
        } else {
          console.error('Failed to fetch current user');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
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

  return (
    <ProfileContainer style={{ width: "70%", margin: '0 auto' }}>
      <h1>{profile.name}</h1>
      <p><strong>Användarnamn:</strong> {profile.username}</p>
      <p><strong>Namn:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Ålder:</strong> {profile.age}</p>
      <p><strong>Arbetsplats:</strong> {profile.workplace}</p>
      <p><strong>Skola:</strong> {profile.school}</p>
      <p><strong>Bio:</strong> {profile.bio}</p>
      <Button onClick={() => navigate('/edit-profile')}>Redigera</Button>
      <div>
        <h3>Mitt flöde:</h3>
      {posts.length > 0 ? (
    posts
      .filter(post => post.username === currentUser) 
      .map((post) => (
        <div key={post.id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
          <p><strong>{post.username}</strong> säger:</p>
          <p>{post.content}</p>
          <p style={{ fontSize: '0.8em', color: '#555' }}>{new Date(post.createdAt).toLocaleString()}</p>
          
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
